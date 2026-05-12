type Props = {
  log: string[];
};

export function GameLog({ log }: Props) {
  const entries = log.slice(-20).reverse();

  function metaFor(event: string) {
    if (event.includes("rolled")) return { icon: "🎲", tone: "roll" };
    if (event.includes("summoned")) return { icon: "✦", tone: "summon" };
    if (event.includes("moved")) return { icon: "👢", tone: "move" };
    if (event.includes("attacked")) return { icon: "⚔", tone: "attack" };
    if (event.includes("destroyed")) return { icon: "◆", tone: "destroy" };
    if (event.includes("ended turn")) return { icon: "⏳", tone: "turn" };
    return { icon: "•", tone: "plain" };
  }

  return (
    <section className="panel game-log" aria-label="Game log">
      <h2>Battle Feed</h2>
      <ol>
        {entries.map((event, index) => (
          <li className={index === 0 ? "log-entry log-entry--new" : "log-entry"} key={`${event}-${index}`}>
            <span className={`log-entry__icon log-entry__icon--${metaFor(event).tone}`}>{metaFor(event).icon}</span>
            <p>{event}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
