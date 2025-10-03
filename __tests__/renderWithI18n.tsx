import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Locale, NextIntlClientProvider } from "next-intl";
import frMessages from "@/src/messages/fr.json";

// Type
interface RenderWithIntlOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: Locale;
}

// Wrapper
function IntlWrapper({
  children,
  locale = "fr", // default
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={frMessages}
    >
      {children}
    </NextIntlClientProvider>
  );
}

// Custom render function
export function renderWithI18n(
  ui: ReactElement,
  options: RenderWithIntlOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <IntlWrapper locale={options.locale ?? "fr"}>{children}</IntlWrapper>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
