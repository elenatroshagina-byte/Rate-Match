import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Checkbox,
  DashedButton,
  Hint,
  Icon,
  PrimaryButton,
  ReactorTheme,
  Select,
  Switch,
  Tag,
  Text,
  WarningAlert
} from "@reactor/reactor";
import "./styles.css";

type TabId = "hotel" | "rooms" | "rates" | "pricing";
type RateState = "idle" | "connecting" | "connected" | "authError" | "mappingError";
type RateKey = "breakfast" | "without" | "holiday" | "special" | "improved" | "comfort";

type StackProps = {
  children: React.ReactNode;
  gap?: number;
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
};

function Row({ alignItems, children, gap = 0, justifyContent }: StackProps) {
  return (
    <div className="row-stack" style={{ alignItems, gap, justifyContent }}>
      {children}
    </div>
  );
}

function Column({ alignItems, children, gap = 0, justifyContent }: StackProps) {
  return (
    <div className="column-stack" style={{ alignItems, gap, justifyContent }}>
      {children}
    </div>
  );
}

type Hotel = {
  name: string;
  address: string;
  sources: string;
};

const hotels: Hotel[] = [
  {
    name: "Deluxe Retail Room 4 - SPA",
    address: "Soi Hemingways Silk, Patong, Phuket",
    sources: "Booking engine, Yandex Travel, Agoda"
  },
  {
    name: "Patong Beach Resort",
    address: "Bangla Road, Patong, Phuket, Thailand",
    sources: "Booking engine, Yandex Travel, Agoda"
  },
  {
    name: "Ocean View Suite - Promo",
    address: "Kata Beach, Phuket, Thailand",
    sources: "Booking engine, Yandex Travel, Agoda"
  },
  {
    name: "Mountain Escape Lodge",
    address: "Chatuchak Market area, Bangkok, Thailand",
    sources: "Booking engine, Yandex Travel, Agoda"
  },
  {
    name: "City Center Apartment",
    address: "Khao San Road, Bangkok, Thailand",
    sources: "Booking engine, Agoda, Ostrovok"
  },
  {
    name: "Historic Downtown Inn",
    address: "River Kwai Bridge, Kanchanaburi, Thailand",
    sources: "Booking engine, Yandex Travel, Agoda"
  }
];

const roomRows = [
  { internal: "Deluxe" },
  { internal: "Standard" },
  { internal: "Comfort" }
];

const bookingOptions = [
  { text: "Standard Double Room", value: "standard" },
  { text: "Superior Twin Room", value: "superior" },
  { text: "Deluxe Room with Sea View", value: "deluxe" },
  { text: "Family Suite", value: "family" },
  { text: "Junior Suite with Balcony", value: "junior" },
  { text: "Presidential Suite", value: "presidential" }
];

const languageOptions = [
  { text: "Russian", value: "ru" },
  { text: "English", value: "en" }
];

const currencyOptions = [
  { text: "Euro", value: "eur" },
  { text: "RU", value: "ru" },
  { text: "USD", value: "usd" }
];

const tabs: Array<{ id: TabId; title: string; hint: string }> = [
  {
    id: "hotel",
    title: "Hotel, language and currency",
    hint: "Add a main hotel first."
  },
  {
    id: "rooms",
    title: "Room category matching",
    hint: "Add the main hotel and wait until categories are loaded."
  },
  {
    id: "rates",
    title: "Rate connection",
    hint: "Match at least one room category."
  },
  {
    id: "pricing",
    title: "Rate price settings",
    hint: "Connect a rate to Rate Match first."
  }
];

const menuItems = [
  ["lamp", "Assistant"],
  ["calendar", "Room management"],
  ["house", "Hotel settings"],
  ["table", "Hotel management"],
  ["hive", "Channel manager"],
  ["meta", "Metasearch"],
  ["sync", "PMS integration"],
  ["forum", "Reputation"],
  ["desktop", "Website builder"],
  ["hub", "Network website"],
  ["insights", "Price optimizer"],
  ["file", "Order management"],
  ["mail", "Marketing"],
  ["folder", "Documents"],
  ["user-check", "Online check-in"],
  ["chart", "Reports"],
  ["scale", "Price comparison"],
  ["shuffle", "Rate Match"],
  ["users", "Guest management"],
  ["layout", "Booking module"]
] as const;

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("hotel");
  const [hotelDialog, setHotelDialog] = useState(false);
  const [hotelStatus, setHotelStatus] = useState<"empty" | "loading" | "ready">("empty");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("eur");
  const [roomValues, setRoomValues] = useState<Record<string, string[]>>({
    "Standard King": ["standard"],
    "Superior Twin": ["superior"]
  });
  const [roomsSaved, setRoomsSaved] = useState(false);
  const [rateStates, setRateStates] = useState<Record<RateKey, RateState>>({
    breakfast: "idle",
    without: "idle",
    holiday: "idle",
    special: "idle",
    improved: "idle",
    comfort: "idle"
  });
  const [pricingSaved, setPricingSaved] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [snackbar, setSnackbar] = useState("");
  const rateConnected = Object.values(rateStates).includes("connected");

  const unlocked = useMemo(
    () => ({
      hotel: true,
      rooms: hotelStatus === "ready",
      rates: roomsSaved,
      pricing: rateConnected
    }),
    [hotelStatus, roomsSaved, rateConnected]
  );

  const allConfigured = hotelStatus === "ready" && roomsSaved && rateConnected;

  const completeTabs = {
    hotel: hotelStatus === "ready",
    rooms: roomsSaved,
    rates: rateConnected,
    pricing: pricingSaved
  };

  const showToast = (text: string) => {
    setSnackbar(text);
    window.setTimeout(() => setSnackbar(""), 2600);
  };

  const toggleRateMatch = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    showToast(nextEnabled ? "Rate Match has been activated." : "Rate Match has been deactivated.");
  };

  const addHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHotelDialog(false);
    setHotelStatus("loading");
  };

  const finishLoading = () => {
    setHotelStatus("ready");
    showToast("Hotel added. Room categories are ready to match.");
  };

  const saveRooms = () => {
    setRoomsSaved(true);
    showToast("Room category matching saved.");
  };

  const connectRate = (key: RateKey, target: RateState = "connected") => {
    setRateStates((current) => ({ ...current, [key]: "connecting" }));
    window.setTimeout(() => {
      setRateStates((current) => ({ ...current, [key]: target }));
      if (target === "connected") {
        showToast("Rate connected.");
      }
    }, 850);
  };

  const activationItems = [
    hotelStatus !== "ready" ? "Add the main hotel with the booking module and at least one OTA. Wait until categories are loaded." : undefined,
    !roomsSaved ? "Match at least one room category." : undefined,
    !rateConnected ? "Connect at least one rate." : undefined
  ].filter(Boolean);

  return (
    <ReactorTheme theme="global" themeMode="light">
      <div className="app-shell">
        <Sidebar />
        <Ribbon onBack={() => (hotelDialog ? setHotelDialog(false) : undefined)} />

        <main className="workspace">
          {hotelDialog ? (
            <HotelPicker onAdd={addHotel} />
          ) : (
            <>
              <h1 className="page-title">Settings</h1>
              <ActivationPanel
                allConfigured={allConfigured}
                enabled={enabled}
                items={activationItems as string[]}
                onToggleEnabled={toggleRateMatch}
              />
              <Tabs activeTab={activeTab} completeTabs={completeTabs} setActiveTab={setActiveTab} unlocked={unlocked} />

              {activeTab === "hotel" && (
                <HotelStep
                  hotelStatus={hotelStatus}
                  language={language}
                  selectedHotel={selectedHotel}
                  currency={currency}
                  setCurrency={setCurrency}
                  setHotelDialog={setHotelDialog}
                  setLanguage={setLanguage}
                  finishLoading={finishLoading}
                />
              )}
              {activeTab === "rooms" && (
                <RoomsStep roomValues={roomValues} setRoomValues={setRoomValues} saveRooms={saveRooms} roomsSaved={roomsSaved} />
              )}
              {activeTab === "rates" && <RatesStep rateStates={rateStates} connectRate={connectRate} />}
              {activeTab === "pricing" && <PricingStep pricingSaved={pricingSaved} setPricingSaved={setPricingSaved} showToast={showToast} />}
            </>
          )}
        </main>
        <footer className="footer">© TRAVELLINE SYSTEMS LLC, 2021 - 2024<br />TravelLine: Platform. Automation solutions for hospitality</footer>

        {snackbar ? (
          <div className="snackbar" role="status">
            <SnackbarCard text={snackbar} close={() => setSnackbar("")} />
          </div>
        ) : null}
      </div>
    </ReactorTheme>
  );
}

function SnackbarCard({ close, text }: { close: () => void; text: string }) {
  return (
    <div className="snackbar-card">
      <Icon name="success" color="foreground-inverse" size="xs" />
      <Text color="foreground-inverse" text={text} />
      <button className="snackbar-card-close" onClick={close} aria-label="Close notification">
        <Icon name="cancel-filled" color="foreground-inverse" size="xs" />
      </button>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="provider">
        <button className="provider-menu" aria-label="Provider menu">
          <Icon name="more-vert" size="xs" color="foreground-inverse" />
        </button>
        <span className="provider-avatar">H</span>
        <div className="provider-copy">
          <span>Provider name</span>
          <small>000000&nbsp;&nbsp;&nbsp;Petropavlovsk-Kam...</small>
        </div>
      </div>
      <div className="menu-list">
        {menuItems.map(([icon, item]) => (
          <React.Fragment key={item}>
            <button className={item === "Rate Match" ? "menu-item menu-parent active-parent" : "menu-item"}>
              <Icon name={icon} size="xs" color="accent" />
              <span>{item}</span>
              <Icon name={item === "Rate Match" || item === "Hotel settings" ? "arrow-drop-up" : "arrow-drop-down"} size="xs" color="accent" />
            </button>
            {item === "Rate Match" ? (
              <button className="menu-subitem">
                <span>Settings</span>
                <span className="admin-badge">A</span>
              </button>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}

function Ribbon({ onBack }: { onBack: () => void }) {
  return (
    <header className="ribbon">
      <button className="ribbon-back" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left" size="sm" color="accent" />
      </button>
      <div className="ribbon-spacer" />
      <button className="knowledge-button">
        <Icon name="book" size="xs" color="foreground-inverse" />
        Knowledge base
      </button>
      <button className="chat-button">
        <Icon name="chat" size="xs" color="accent" />
        Chat
      </button>
      {["case", "settings", "notification", "help", "search"].map((icon) => (
        <button className="ribbon-icon" key={icon}>
          <Icon name={icon} size="xs" color="accent" />
          {icon === "notification" ? <span className="notification-dot">3</span> : null}
        </button>
      ))}
      <div className="user-chip">
        <Icon name="account" size="xs" color="accent" />
        user.name
      </div>
    </header>
  );
}

function ActivationPanel({
  allConfigured,
  enabled,
  items,
  onToggleEnabled
}: {
  allConfigured: boolean;
  enabled: boolean;
  items: string[];
  onToggleEnabled: () => void;
}) {
  return (
    <section className="activation-panel">
      <div className="activation-row">
        <span>Rate Match</span>
        <span className={enabled ? "status-pill active" : "status-pill"}>{enabled ? "ACTIVE" : "INACTIVE"}</span>
        <div className={allConfigured && !enabled ? "attention-toggle" : ""}>
          <Switch
            accent
            disabled={!allConfigured}
            selected={enabled}
            onClick={() => allConfigured && onToggleEnabled()}
            hint={!allConfigured ? "Complete all settings before activation." : "Turn Rate Match on or off."}
          />
        </div>
      </div>
      {!allConfigured ? (
        <div className="warning-box">
          <Icon name="warning" color="warning" size="xs" />
          <div>
            <strong>Complete settings to activate:</strong>
            <ol>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Tabs({
  activeTab,
  completeTabs,
  setActiveTab,
  unlocked
}: {
  activeTab: TabId;
  completeTabs: Record<TabId, boolean>;
  setActiveTab: (tab: TabId) => void;
  unlocked: Record<TabId, boolean>;
}) {
  return (
    <nav className="tabs" aria-label="Setup tabs">
      {tabs.map((tab) => {
        const disabled = !unlocked[tab.id];
        return (
          <button
            aria-disabled={disabled}
            className={["tab-button", activeTab === tab.id ? "active" : "", disabled ? "disabled" : ""].join(" ")}
            key={tab.id}
            onClick={() => {
              if (!disabled) {
                setActiveTab(tab.id);
              }
            }}
          >
            <span>{tab.title}</span>
            {completeTabs[tab.id] ? (
              <Icon name="check" color="success" size="xs" />
            ) : disabled && tab.id !== "pricing" ? (
              <span
                className="help-dot"
                onClick={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
                tabIndex={0}
              >
                <Icon name="help" color="neutral" size="xs" />
                <span className="tab-hint" role="tooltip">
                  <Hint text={tab.hint} />
                </span>
              </span>
            ) : !disabled && tab.id !== "pricing" ? (
              <Icon name="warning" color="warning" size="xs" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function HotelStep(props: {
  hotelStatus: "empty" | "loading" | "ready";
  selectedHotel: Hotel | null;
  language: string;
  currency: string;
  setHotelDialog: (value: boolean) => void;
  setLanguage: (value: string) => void;
  setCurrency: (value: string) => void;
  finishLoading: () => void;
}) {
  return (
    <Column gap={24}>
      <section className="figma-card main-hotel-card">
        <div className="card-header">
          <h2>Main hotel</h2>
          {props.hotelStatus === "empty" ? (
            <DashedButton icon="add" text="Add" onClick={() => props.setHotelDialog(true)} />
          ) : (
            <DashedButton text="Change" onClick={() => props.setHotelDialog(true)} />
          )}
        </div>

        {props.hotelStatus === "empty" ? (
          <div className="empty-state">
            <Text text="Hotel has not been added, add it" color="neutral" />
          </div>
        ) : null}

        {props.hotelStatus === "loading" ? (
          <button className="loading-hotel" onClick={props.finishLoading}>
            <p>{props.selectedHotel?.name}, Thailand, Phuket, Patong, Bangla Road 77.</p>
            <span className="loading-badge">LOADING CATEGORIES...</span>
            <div className="info-strip">
              <Icon name="info" color="info" size="xs" />
              <span>Wait until loading is complete, then match categories</span>
            </div>
          </button>
        ) : null}

        {props.hotelStatus === "ready" && props.selectedHotel ? (
          <div className="hotel-summary">
            <p>{props.selectedHotel.name}, Thailand, Phuket, Patong, Bangla Road 77</p>
            <p>Sources: Booking Engine, Booking.com</p>
            <button className="link-action">
              <Icon name="sync" color="accent" size="xs" />
              Start category collection
            </button>
          </div>
        ) : null}
      </section>

      <section className="figma-card">
        <div className="card-header">
          <h2>Language and currency</h2>
        </div>
        <div className="form-grid">
          <label>Analysis language</label>
          <SimpleSelect
            options={languageOptions}
            value={props.language}
            onChange={(value) => props.setLanguage(String(value))}
          />
          <label>Notification language</label>
          <SimpleSelect
            options={languageOptions}
            value={props.language}
            onChange={(value) => props.setLanguage(String(value))}
          />
          <label>Currency</label>
          <SimpleSelect
            className="currency-select"
            options={currencyOptions}
            value={props.currency}
            onChange={(value) => props.setCurrency(String(value))}
          />
        </div>
      </section>
      <PrimaryButton text="Save" />
    </Column>
  );
}

function HotelPicker({ onAdd }: { onAdd: (hotel: Hotel) => void }) {
  return (
    <>
      <h1 className="page-title add-title">Add hotel</h1>
      <section className="figma-card hotel-list-card">
        <div className="card-header">
          <h2>Hotel list</h2>
        </div>
        <div className="filters-row">
          <Select options={[{ text: "All", value: "all" }]} value="all" onChange={() => undefined} prefix="Country:" size="sm" />
          <Select options={[{ text: "All", value: "all" }]} value="all" onChange={() => undefined} prefix="Region:" size="sm" />
          <Select options={[{ text: "All", value: "all" }]} value="all" onChange={() => undefined} prefix="City:" size="sm" />
          <Button text="Apply" selected />
          <div className="search-field">
            <Icon name="search" color="neutral" size="xs" />
            <span>Name</span>
          </div>
        </div>
        <strong className="hotel-count">Hotels: 1 500</strong>
        <PaginationMock />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Address</th>
                <th>Price collection sources</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.name}>
                  <td>{hotel.name}</td>
                  <td>{hotel.address}</td>
                  <td>{hotel.sources}</td>
                  <td>
                    <DashedButton text="Add" onClick={() => onAdd(hotel)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationMock />
      </section>
    </>
  );
}

function RoomsStep(props: {
  roomValues: Record<string, string[]>;
  setRoomValues: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  saveRooms: () => void;
  roomsSaved: boolean;
}) {
  const [bookingColumnSelected, setBookingColumnSelected] = useState(false);

  return (
    <Column gap={24}>
      <section className="figma-card">
        <div className="card-header">
          <h2>Room category matching</h2>
        </div>
        <div className="card-body">
          <div className="info-strip">
            <Icon name="info" color="info" size="xs" />
            <span>Price override will be applied only to selected categories</span>
          </div>
      <div className="table-wrap room-category-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking engine</th>
              <th>
                <span
                  className="booking-column-toggle"
                  role="button"
                  tabIndex={0}
                  onClick={() => setBookingColumnSelected((selected) => !selected)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setBookingColumnSelected((selected) => !selected);
                    }
                  }}
                >
                  <Checkbox selected={bookingColumnSelected} tabIndex={-1} /> Booking.com
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {roomRows.map((row) => (
              <tr key={row.internal}>
                <td>{row.internal}</td>
                <td>
                  <CategorySelect
                    value={props.roomValues[row.internal] ?? []}
                    onChange={(value) =>
                      props.setRoomValues((current) => ({
                        ...current,
                        [row.internal]: value
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </section>
      <PrimaryButton text="Save" onClick={props.saveRooms} />
    </Column>
  );
}

function SimpleSelect({
  className = "",
  onChange,
  options,
  value
}: {
  className?: string;
  onChange: (value: string) => void;
  options: Array<{ text: string; value: string }>;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.text ?? "Not selected";

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div className={["single-select", className].filter(Boolean).join(" ")} ref={rootRef}>
      <button className={open ? "select-shell open" : "select-shell"} type="button" onClick={() => setOpen(!open)}>
        <span>{selectedLabel}</span>
        <Icon name="arrow-drop-down" color="neutral" size="xs" />
      </button>
      {open ? (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              className={option.value === value ? "dropdown-choice selected" : "dropdown-choice"}
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategorySelect({ onChange, value }: { onChange: (value: string[]) => void; value: string[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabels = bookingOptions.filter((option) => value.includes(option.value)).map((option) => option.text);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  const toggle = (optionValue: string) => {
    onChange(value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
  };

  return (
    <div className="category-select" ref={rootRef}>
      <button className={open ? "select-shell open" : "select-shell"} type="button" onClick={() => setOpen(!open)}>
        <span>{selectedLabels.length ? selectedLabels.join(", ") : "Not selected"}</span>
        <Icon name="arrow-drop-down" color="neutral" size="xs" />
      </button>
      {open ? (
        <div className="dropdown-menu">
          {bookingOptions.map((option) => (
            <label className="dropdown-option" key={option.value}>
              <input
                checked={value.includes(option.value)}
                onChange={() => toggle(option.value)}
                type="checkbox"
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RatesStep({
  connectRate,
  rateStates
}: {
  connectRate: (key: RateKey, target?: RateState) => void;
  rateStates: Record<RateKey, RateState>;
}) {
  const statusMap: Record<RateState, { label: string; color: "neutral" | "info" | "success" | "danger"; hint?: string }> = {
    idle: { label: "Not connected", color: "neutral" },
    connecting: { label: "Connecting", color: "info" },
    connected: { label: "Connected to Rate Match", color: "success" },
    authError: { label: "Connection error", color: "danger", hint: "A rate named BestDeal:test already exists. Rename the rate and try connecting it again." },
    mappingError: { label: "Connection error", color: "danger", hint: "This rate does not have a booking form." }
  };
  const rateRows: Array<{ key: RateKey; name: string; target: RateState; actionAfterError?: string }> = [
    { key: "breakfast", name: "Rate with breakfast", target: "connected" },
    { key: "without", name: "Rate without breakfast", target: "authError", actionAfterError: "Retry connection" },
    { key: "holiday", name: "Holiday New Year rate", target: "mappingError", actionAfterError: "Cancel" },
    { key: "special", name: "Special improved Comfort Plus room category rate", target: "connected" },
    { key: "improved", name: "Improved Comfort Plus category rate", target: "connected" },
    { key: "comfort", name: "Comfort Plus category rate", target: "connected" }
  ];

  return (
    <Column gap={24}>
      <section className="figma-card">
        <div className="card-header">
          <h2>{Object.values(rateStates).includes("connected") ? "Connect rates to Rate Match" : "Rates"}</h2>
        </div>
        <div className="card-body">
          <div className="info-strip">
            <Icon name="info" color="info" size="xs" />
            <span>Select standalone rates. Rate Match will automatically override prices for inherited rates created from them.</span>
          </div>
          <div className="rates-toolbar">
            <Button text="Connection status: All" flip icon="arrow-drop-down" />
            <div className="search-field small">
              <span>Enter part of the name</span>
              <Icon name="search" color="accent" size="xs" />
            </div>
          </div>
      <div className="table-wrap rates-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rate</th>
              <th>Connection status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rateRows.map((row) => {
              const rateState = rateStates[row.key];
              const status = statusMap[rateState];
              const actionText =
                rateState === "connected"
                  ? "Connected to Rate Match"
                  : rateState === "connecting"
                    ? "Connecting..."
                    : rateState === "authError" || rateState === "mappingError"
                      ? row.actionAfterError ?? "Retry connection"
                      : "Connect to Rate Match";

              return (
              <tr key={row.key}>
                <td><a>{row.name}</a></td>
                <td>
                  {rateState !== "idle" ? (
                    <span className="status-cell" title={status.hint} tabIndex={status.hint ? 0 : undefined}>
                      <Tag text={status.label} color={status.color} filled={rateState === "connected"} />
                      {status.hint ? (
                        <span className="status-hint" role="tooltip">
                          <Hint text={status.hint} />
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </td>
                <td>
                  <Button
                    icon={rateState === "connecting" ? "loading" : rateState === "authError" ? "danger" : rateState === "mappingError" ? "cancel" : "connection"}
                    text={actionText}
                    disabled={rateState === "connecting" || rateState === "connected"}
                    onClick={() => connectRate(row.key, row.target)}
                  />
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        </div>
      </section>
    </Column>
  );
}

function PricingStep(props: { pricingSaved: boolean; setPricingSaved: (value: boolean) => void; showToast: (text: string) => void }) {
  const [maxDiscount, setMaxDiscount] = useState("40");
  const [raiseToParity, setRaiseToParity] = useState(false);

  return (
    <Column gap={24}>
      <section className="figma-card price-settings-card">
        <div className="card-header">
          <h2>Rate price settings</h2>
        </div>
        <div className="card-body">
          <div className="price-settings-form">
            <label className="price-setting-label" htmlFor="max-discount">Maximum discount</label>
            <div className="discount-control">
              <input
                className="price-input"
                id="max-discount"
                inputMode="numeric"
                onChange={(event) => setMaxDiscount(event.target.value)}
                value={maxDiscount}
              />
              <span>%</span>
            </div>
            <Text
              color="disabled"
              text="Maximum percentage by which the rate price can decrease from the base price."
            />

            <label className="price-setting-label">Price increase mode up to parity</label>
            <Switch
              accent
              selected={raiseToParity}
              onClick={() => setRaiseToParity((value) => !value)}
            />
            <Text
              color="disabled"
              text="The price can decrease and increase up to parity with the channel."
            />
          </div>
        </div>
      </section>
      <PrimaryButton
        icon="check"
        text="Save"
        onClick={() => {
          props.setPricingSaved(true);
          props.showToast("Rate price settings saved.");
        }}
      />
    </Column>
  );
}

function PaginationMock() {
  return (
    <div className="pagination-mock">
      <span>‹‹</span>
      <span>‹</span>
      <span>...</span>
      {[1, 2, 3, 4, 5, 6].map((page) => (
        <button className={page === 1 ? "current" : ""} key={page}>{page}</button>
      ))}
      <span>›</span>
      <span>››</span>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
