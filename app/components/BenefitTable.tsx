"use client";

import { getAllBenefits } from "../lib/benefits";
import type { Benefit } from "@/app/types";

import Link from "next/link";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";

// Importing traffic lights designed by Alistair
import GreenTrafficLight from "@/public/ranking-table/traffic-light-green.png";
import AmberTrafficLight from "@/public/ranking-table/traffic-light-amber.png";
import RedTrafficLight from "@/public/ranking-table/traffic-light-red.png";

const header = (
  <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    <span className="text-xl text-900 font-bold">Benefits Table</span>
  </div>
);

const ratingBenefitValue = (row: Benefit) => {
  const value = Number(row.value) || 0; // coerce to number, fallback 0
  return <Rating value={value} readOnly cancel={false} stars={5} />;
};

const ratingBenefitDifficulty = (row: Benefit) => {
  const difficulty = Number(row.difficulty) || 0;
  console.log(row);
  if (difficulty === 1) {
    return (
      <img
        src={GreenTrafficLight.src}
        alt="custom-cancel-image"
        width="25"
        height="25"
        className="block mx-auto"
      />
    );
  } else if (difficulty == 2) {
    return (
      <img
        src={AmberTrafficLight.src}
        alt="amber-traffic-light"
        width="25"
        height="25"
        className="block mx-auto"
      />
    );
  } else if (difficulty == 3) {
    return (
      <img
        src={RedTrafficLight.src}
        alt="red-traffic-light"
        width="25"
        height="25"
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
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Benefit ranking table
      </h2>
      <DataTable
        value={benefits}
        dataKey="id"
        removableSort
        showGridlines
        className="w-full text-sm md:text-base mt-3"
        tableStyle={{ width: "100%" }}
        rowClassName={(row: Benefit) => ({
          "bg-advokit-red": row.difficulty === 3,
          "bg-advokit-amber": row.difficulty === 2,
          "bg-advokit-green": row.difficulty === 1,
        })}
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
