type Props = {
  log: string[];
};

export function GameLog({ log }: Props) {
  const entries = log.slice(-20).reverse();

  function iconFor(event: string) {
    if (event.includes("rolled")) return "🎲";
    if (event.includes("summoned")) return "✦";
    if (event.includes("moved")) return "👢";
    if (event.includes("attacked")) return "⚔";
    if (event.includes("destroyed")) return "◆";
    if (event.includes("ended turn")) return "⏳";
    return "•";
  }

  return (
    <section className="panel game-log" aria-label="Game log">
      <h2>Battle Feed</h2>
      <ol>
        {entries.map((event, index) => (
          <li className={index === 0 ? "log-entry log-entry--new" : "log-entry"} key={`${event}-${index}`}>
            <span>{iconFor(event)}</span>
            <p>{event}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
