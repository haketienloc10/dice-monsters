import type { PlayerId } from "../game/types";

type Props = {
  owner: PlayerId;
  hp: number;
  hit?: boolean;
};

export function CoreBase({ owner, hp, hit = false }: Props) {
  const isP1 = owner === "P1";
  const className = ["core-base", `core-base--${owner.toLowerCase()}`, hit ? "core-base--hit" : ""].filter(Boolean).join(" ");

  return (
    <span className={className} title={`${owner} Heart Core HP ${hp}`}>
      <span className="core-base__platform" />
      <span className="core-base__crystal" aria-hidden="true">{isP1 ? "◆" : "▲"}</span>
      <span className="core-base__heart" aria-hidden="true">♥</span>
      <span className="core-base__hp">{hp}</span>
    </span>
  );
}
