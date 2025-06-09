"use client";
import Form from "../widgets/Form";
import Configuration from "../widgets/Configuration";
import { useState } from 'react';

export default function Home() {
  const [configValues, setConfigValues] = useState({ advanced: false, template: 'fastl4'});

  return (
    <div className="grid items-left justify-items-left p-1 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main >
        <div className="flex flex-row justify-items-start align-center items-center sm:items-start">
          <h1 className="text-2xl font-bold mb-4">NLB Automation</h1>
          <Configuration configValues={configValues} setConfigValues={setConfigValues} />
        </div>
        <div className="flex flex-row justify-items-start align-center items-center sm:items-start">
          <Form configValues={configValues} />

        </div>
      </main>
    </div>
  );
}
