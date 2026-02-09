# ---- bootstrap / config (MUST BE FIRST) ----
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT_DIR / ".env.local"
load_dotenv(dotenv_path=ENV_PATH)

# ---- standard imports ----
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import pandas as pd

import streamlit as st
from pymongo import MongoClient, DESCENDING


# ---------------- CONFIG ----------------
DB_NAME = "advokit"
COLLECTION_NAME = "chat_logs"

SESSION_ID_FIELD = "sessionId"
CREATED_AT_FIELD = "createdAt"

MESSAGES_FIELD = "messages"
INTERACTIONS_FIELD = "interactions"

ROLE_FIELD = "role"
CONTENT_FIELD = "content"
MSG_TS_FIELD = "createdAtISO"

EVT_TS_FIELD = "createdAtISO"
EVT_TYPE_FIELD = "type"
# ----------------------------------------


def parse_iso(ts: Optional[str]) -> Optional[datetime]:
    """Parse ISO like '2026-02-09T14:51:22.923Z' to aware datetime."""
    if not ts or not isinstance(ts, str):
        return None
    try:
        if ts.endswith("Z"):
            ts = ts[:-1] + "+00:00"
        return datetime.fromisoformat(ts)
    except Exception:
        return None


@st.cache_resource
def get_client() -> MongoClient:
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise RuntimeError("Missing MONGODB_URI env var (check .env.local path)")
    return MongoClient(uri)


def get_full_data():
    client = get_client()
    return client[DB_NAME][COLLECTION_NAME]


def list_latest_sessions(col, limit: int = 200) -> List[Dict[str, Any]]:
    """
    Returns ONE row per sessionId, always the latest snapshot by createdAt.
    This avoids dict-overwrite bugs by doing grouping in Mongo.
    """
    pipeline = [
        # Ensure newest docs first
        {"$sort": {CREATED_AT_FIELD: -1}},
        # Group by sessionId and keep newest doc as "latest"
        {
            "$group": {
                "_id": f"${SESSION_ID_FIELD}",
                "latest_doc": {"$first": "$$ROOT"},
                "versions": {"$sum": 1},
            }
        },
        # Sort sessions by latest createdAt
        {"$sort": {"latest_doc." + CREATED_AT_FIELD: -1}},
        {"$limit": limit},
        # Project to a nice shape
        {
            "$project": {
                "_id": 0,
                "sessionId": "$_id",
                "docId": "$latest_doc._id",
                "createdAt": "$latest_doc." + CREATED_AT_FIELD,
                "displayName": "$latest_doc.participant.displayName",
                "participantId": "$latest_doc.participant.participantId",
                "model": "$latest_doc.model",
                "n_messages": {"$size": {"$ifNull": ["$latest_doc." + MESSAGES_FIELD, []]}},
                "n_events": {"$size": {"$ifNull": ["$latest_doc." + INTERACTIONS_FIELD, []]}},
                "versions": 1,
            }
        },
    ]

    return list(col.aggregate(pipeline))


def list_all_snapshots(col, limit: int = 500) -> List[Dict[str, Any]]:
    """
    Returns one row per DOCUMENT snapshot (unique _id), sorted by createdAt desc.
    Useful for debugging snapshot logging.
    """
    cursor = (
        col.find(
            {},
            {
                SESSION_ID_FIELD: 1,
                CREATED_AT_FIELD: 1,
                "participant.displayName": 1,
                "participant.participantId": 1,
                "model": 1,
                MESSAGES_FIELD: 1,
                INTERACTIONS_FIELD: 1,
            },
        )
        .sort(CREATED_AT_FIELD, DESCENDING)
        .limit(limit)
    )

    rows = []
    for d in cursor:
        rows.append(
            {
                "docId": d.get("_id"),
                "sessionId": d.get(SESSION_ID_FIELD) or "",
                "createdAt": d.get(CREATED_AT_FIELD),
                "displayName": (d.get("participant") or {}).get("displayName"),
                "participantId": (d.get("participant") or {}).get("participantId"),
                "model": d.get("model"),
                "n_messages": len(d.get(MESSAGES_FIELD) or []),
                "n_events": len(d.get(INTERACTIONS_FIELD) or []),
                "versions": None,
            }
        )
    return rows


def load_doc_by_id(col, doc_id) -> Optional[Dict[str, Any]]:
    return col.find_one({"_id": doc_id})
# → “Now fetch the real MongoDB document”

def build_timeline(doc: Dict[str, Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []

    for m in doc.get(MESSAGES_FIELD) or []:
        out.append(
            {
                "kind": "message",
                "ts": parse_iso(m.get(MSG_TS_FIELD)),
                "role": (m.get(ROLE_FIELD) or "unknown").lower(),
                "content": m.get(CONTENT_FIELD) or "",
                "raw": m,
            }
        )

    for e in doc.get(INTERACTIONS_FIELD) or []:
        out.append(
            {
                "kind": "event",
                "ts": parse_iso(e.get(EVT_TS_FIELD)),
                "event_type": e.get(EVT_TYPE_FIELD) or "unknown",
                "raw": e,
            }
        )

    out.sort(key=lambda x: x["ts"] or datetime.max.replace(tzinfo=timezone.utc))
    return out


def fmt_when(dt: Any) -> str:
    if isinstance(dt, datetime):
        return dt.isoformat(sep=" ", timespec="seconds")
    return str(dt)


# MISSING ANALYSIS OF EVENTS AND CONVERSATION LENGTHS / AVG TURN TIMES
# ---------------- UI ----------------
st.set_page_config(page_title="Advokit Data Viewer", layout="wide")

tab_chat_logs, tab_viz = st.tabs(["Chat Logs", "Visualisations"])

with tab_chat_logs:
    st.header("Benefit Buddy Chat Logs")

    # IMPORTANT: treat this as your Mongo collection
    col = get_full_data()  # ideally this returns db[DB_NAME][COLLECTION_NAME]

    with st.sidebar:
        st.header("Filter Advokit sessions")

        if st.button("🔄 Refresh", key="chatlogs_refresh"):
            st.cache_data.clear()
            st.cache_resource.clear()
            st.rerun()

        mode = st.radio(
            "Dropdown mode",
            ["Latest per user session", "All snapshots"],
            index=0,
            key="chatlogs_mode",
        )

        q = st.text_input("Filter (sessionId / name)", "", key="chatlogs_query")

        # Build rows for dropdown
        if mode == "Latest per session":
            rows = list_latest_sessions(col)       # 1 row per sessionId (latest snapshot)
        else:
            rows = list_all_snapshots(col)         # 1 row per document snapshot

        # Apply filter
        if q.strip():
            qq = q.strip().lower()
            rows = [
                r for r in rows
                if qq in str(r.get("sessionId", "")).lower()
                or qq in str(r.get("displayName", "")).lower()
            ]

        if not rows:
            st.warning("No results.")
            st.stop()

        # Dropdown options are UNIQUE doc ids (Mongo _id)
        doc_options = [r["docId"] for r in rows]
        row_by_docid = {r["docId"]: r for r in rows}

        def label_for_docid(docid) -> str:
            r = row_by_docid[docid]
            who = r.get("displayName") or "Unknown"
            when_str = fmt_when(r.get("createdAt"))
            msgs = r.get("n_messages", -1)
            # If you want, include sessionId:  + f" — {r.get('sessionId','')}"
            return f"{who} — {when_str} — {msgs} msgs"

        chosen_docid = st.selectbox(
            "Select",
            doc_options,
            format_func=label_for_docid,
            key="chatlogs_doc_select",
        )

        # Metrics (always correct)
        unique_sessions = len({r.get("sessionId") for r in rows if r.get("sessionId")})
        st.metric("Unique user sessions", unique_sessions)
        st.metric("Documents shown", len(rows))

        # View toggles
        show_messages = st.checkbox("Show messages", value=True, key="chatlogs_show_messages")
        show_events = st.checkbox("Show events", value=True, key="chatlogs_show_events")
        unify = st.checkbox("Unified timeline", value=True, key="chatlogs_unify")

    # ---- load chosen document (by _id) ----
    doc = load_doc_by_id(col, chosen_docid)
    if doc is None:
        st.warning("Selected document not found.")
        st.stop()

    # ---- layout ----
    meta_left, meta_right = st.columns([1, 3], gap="large")

    with meta_left:
        st.subheader((doc.get("participant") or {}).get("displayName") or "Unknown")
        st.write(doc.get("sessionId")) 
        st.subheader("Loaded snapshot")
        st.caption(
            f"_id: {doc.get('_id')} | sessionId: {doc.get('sessionId')} | "
            f"messages: {len(doc.get('messages') or [])} | events: {len(doc.get('interactions') or [])}"
        )

        st.json(
            {
                "sessionId": doc.get("sessionId"),
                "createdAt": doc.get("createdAt"),
                "participant": doc.get("participant"),
                "model": doc.get("model"),
                "caseContext": doc.get("caseContext"),
            }
        )

    with meta_right:
        st.subheader("Transcript")
        if unify:
            timeline = build_timeline(doc)
            for i, item in enumerate(timeline, 1):
                if item["kind"] == "message" and show_messages:
                    role = item["role"]
                    ts = item["ts"]
                    ts_str = ts.isoformat(sep=" ", timespec="seconds") if isinstance(ts, datetime) else ""

                    if role == "user":
                        st.markdown(f"**{i}. User** — {ts_str}")
                        st.write(item["content"])
                    elif role == "assistant":
                        st.markdown(f"**{i}. Assistant** — {ts_str}")
                        st.write(item["content"])
                    else:
                        st.markdown(f"**{i}. {role.title()}** — {ts_str}")
                        st.code(item["content"], language="text")

                if item["kind"] == "event" and show_events:
                    ts = item["ts"]
                    ts_str = ts.isoformat(sep=" ", timespec="seconds") if isinstance(ts, datetime) else ""
                    et = item.get("event_type", "unknown")
                    st.caption(f"🧾 Event — `{et}` — {ts_str}")
                    with st.expander("event details", expanded=False):
                        st.json(item["raw"])
        else:
            if show_messages:
                st.markdown("### Messages")
                for i, m in enumerate(doc.get("messages") or [], 1):
                    role = (m.get("role") or "unknown").lower()
                    ts = parse_iso(m.get("createdAtISO"))
                    ts_str = ts.isoformat(sep=" ", timespec="seconds") if isinstance(ts, datetime) else ""
                    st.markdown(f"**{i}. {role.title()}** — {ts_str}")
                    st.write(m.get("content", ""))

            if show_events:
                st.markdown("### Interactions")
                for i, e in enumerate(doc.get("interactions") or [], 1):
                    ts = parse_iso(e.get("createdAtISO"))
                    ts_str = ts.isoformat(sep=" ", timespec="seconds") if isinstance(ts, datetime) else ""
                    st.caption(f"{i}. `{e.get('type','unknown')}` — {ts_str}")
                    with st.expander("details", expanded=False):
                        st.json(e)

with tab_viz:
    st.header("Benefit Buddy Visualisations")

    col = get_full_data()  # your Mongo collection / data handle

    viz_mode = st.radio(
        "Data source",
        ["Latest per session (recommended)", "All snapshots (debug)"],
        horizontal=True,
        key="viz_mode",
    )

    # 1) Get rows (list of dicts)
    if viz_mode.startswith("Latest"):
        rows = list_latest_sessions(col, limit=1000)
    else:
        rows = list_all_snapshots(col, limit=5000)

    # 2) Convert to DataFrame
    df = pd.DataFrame(rows)

    if df.empty:
        st.info("No data available to plot.")
        st.stop()

    # Ensure createdAt is datetime (UTC)
    if "createdAt" in df.columns:
        df["createdAt"] = pd.to_datetime(df["createdAt"], errors="coerce", utc=True)

    # --- KPI cards ---
    unique_sessions = df["sessionId"].nunique() if "sessionId" in df.columns else 0
    total_docs = len(df)

    c1, c2, c3 = st.columns(3)
    c1.metric("Unique user sessions", int(unique_sessions))
    c2.metric("Documents count", int(total_docs))

    if "n_messages" in df.columns and df["n_messages"].notna().any():
        c3.metric("Median messages/session", int(df["n_messages"].median()))
    else:
        c3.metric("Median messages/session", "-")

    st.divider()

    # --- Sessions over time ---
    if "createdAt" in df.columns and df["createdAt"].notna().any():
        st.subheader("Sessions / snapshots over time")

        by_day = (
            df.dropna(subset=["createdAt"])
              .assign(day=lambda d: d["createdAt"].dt.floor("D"))
              .groupby("day")
              .size()
              .reset_index(name="count")
              .sort_values("day")
        )
        st.line_chart(by_day.set_index("day")["count"])

    # --- Messages distribution (only makes sense for latest-per-session rows) ---
    if "n_messages" in df.columns and df["n_messages"].notna().any():
        st.subheader("Messages per session (distribution)")
        bins = [0, 5, 10, 20, 40, 80, 160, 10_000]
        labels = ["0–4", "5–9", "10–19", "20–39", "40–79", "80–159", "160+"]
        msg_bins = pd.cut(df["n_messages"].fillna(0), bins=bins, labels=labels, right=False)
        hist = msg_bins.value_counts().reindex(labels).fillna(0).astype(int)
        st.bar_chart(hist)

    # --- Snapshots per session (only meaningful in All snapshots view) ---
    if viz_mode.startswith("All") and "sessionId" in df.columns:
        st.subheader("Snapshots per session (log frequency)")
        st.caption("Top 20 sessions by number of snapshots")
        # snaps = df.groupby("sessionId").size().sort_values(ascending=False)
        snaps = (
            df.groupby("sessionId", as_index=False)
            .agg(
                displayName=("displayName", lambda s: s.dropna().iloc[0] if s.dropna().size else "Unknown"),
                snapshots=("docId", "size"),          # size counts rows per group
                total_messages=("n_messages", "sum"),
                total_events=("n_events", "sum"),
            )
            .sort_values("snapshots", ascending=False)
            .head(20)
        )
        st.dataframe(snaps.head(20), width="stretch")
      
      # ---- Analysis of events ---- 