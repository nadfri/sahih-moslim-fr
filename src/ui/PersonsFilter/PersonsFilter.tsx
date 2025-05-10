"use client";

import { useMemo, useState } from "react";

import { PersonType } from "@/src/types/types";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { PersonCard } from "../PersonCard/PersonCard";

type Props = {
  persons: PersonType[];
  type: "sahabas" | "narrators";
};

export function PersonFilter({ persons, type }: Props) {
  const [selected, setSelected] = useState("");

  // Filtered sahabas based on selected value
  const filteredPersons = useMemo(() => {
    if (!selected) return persons;
    return persons.filter((person) => person.name === selected);
  }, [persons, selected]);

  // Extract person names for SearchSelect options
  const options = useMemo(
    () => persons.map((person) => person.name),
    [persons]
  );

  const placeholder =
    type === "narrators"
      ? "Rechercher un narrateur..."
      : "Rechercher un compagnon...";

  return (
    <>
      <div className="mb-10">
        <SearchSelect
          id="person-search"
          label=""
          options={options}
          value={selected}
          onChange={setSelected}
          placeholder={placeholder}
        />
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/*Links*/}
          {filteredPersons.map((person) => (
            <PersonCard
              person={person}
              type={type}
              key={person.name}
            />
          ))}
        </div>
      </div>
    </>
  );
}
