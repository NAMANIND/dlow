import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import AccountFrom from "@/components/AccountForm/AccountFrom.js";
import AccountLogin from "@/components/AccountLogin/AccountLogin";

function page() {
  return (
    <NextUIProvider>
      <div className="container mx-auto p-4">
        {/* <AccountFrom /> */}
        <iframe
          allowtransparency="true"
          src="https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=in#%7B%22symbols%22%3A%5B%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ASBIN%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ARELIANCE%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AADANIPORTS%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ATATAMOTORS%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ASENSEX%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AICICINF100%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3AJIOFIN%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BSE%3ABANKBARODA%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A78%2C%22utm_source%22%3A%22capitalonebroking.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22ticker-tape%22%2C%22page-uri%22%3A%22capitalonebroking.com%2Fuser%2Fdashboard%22%7D"
          title="ticker tape TradingView widget"
          lang="en"
        ></iframe>
        <AccountLogin />
      </div>
    </NextUIProvider>
  );
}

export default page;
