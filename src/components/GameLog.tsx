type Props = {
  log: string[];
};

export function GameLog({ log }: Props) {
  return (
    <section className="panel game-log" aria-label="Game log">
      <h2>Log</h2>
      <ol>
        {log.map((event, index) => (
          <li key={`${event}-${index}`}>{event}</li>
        ))}
      </ol>
    </section>
  );
}
