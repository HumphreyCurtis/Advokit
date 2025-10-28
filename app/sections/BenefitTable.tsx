"use client";

import { getAllBenefits } from "../lib/benefits";
import type { Benefit } from "@/app/types";

import Link from "next/link";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Rating } from "primereact/rating";

const header = (
  <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    <span className="text-xl text-900 font-bold">Benefits Table</span>
  </div>
);

const ratingBenefitValue = (row: Benefit) => {
  const value = Number(row.value) || 0; // coerce to number, fallback 0
  return <Rating value={value} readOnly cancel={false} stars={4} />;
};

const ratingBenefitDifficulty = (row: Benefit) => {
  const difficulty = Number(row.difficulty) || 0;

  if (difficulty === 1) {
    return (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Traffic_lights_green.svg"
        alt="custom-cancel-image"
        width="15"
        height="15"
        className="block mx-auto"
      />
    );
  } else if (difficulty == 2) {
    return (
      <img
        src="https://wikieducator.org/images/1/11/Traffic_lights_amber.png"
        alt="amber-traffic-light"
        width="15"
        height="15"
        className="block mx-auto"
      />
    );
  } else if (difficulty == 3) {
    return (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/45/Traffic_lights_red.svg"
        alt="red-traffic-light"
        width="15"
        height="15"
        className="block mx-auto"
      />
    );
  }

  return "";
};

export default function BenefitTable() {
  const benefits = getAllBenefits();

  return (
    <div className="card">
      <DataTable
        value={benefits}
        dataKey="id"
        removableSort
        stripedRows
        showGridlines
        className="w-full text-xs sm:text-sm"
        // header={header}
      >
        <Column
          field="title"
          header="Title"
          sortable
          body={(benefit: Benefit) => (
            <Link
              href={`/benefits/${benefit.slug}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline underline-offset-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${benefit.title}`}
            >
              {benefit.title}
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
        ></Column>
        <Column
          field="difficulty"
          header="Difficulty"
          body={ratingBenefitDifficulty}
          sortable
        ></Column>
        <Column
          field="value"
          header="Value"
          body={ratingBenefitValue}
          sortable
        ></Column>
      </DataTable>
    </div>
  );
}
