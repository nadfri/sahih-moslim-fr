// Import jest-dom matchers to extend Vitest's expect
import "@testing-library/jest-dom/vitest";

import { beforeEach } from "node:test";
import { cleanup } from "@testing-library/react";

beforeEach(() => cleanup());
