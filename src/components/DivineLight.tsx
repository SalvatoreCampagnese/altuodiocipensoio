/**
 * Le due sorgenti di luce negli angoli alti della pagina.
 *
 * Ogni sorgente è un alone morbido più un ventaglio di raggi. Entrano in
 * dissolvenza al caricamento ("la luce arriva"), poi respirano piano. È un
 * livello fisso e inerte: sta dietro a tutto e non intercetta il mouse.
 */
export function DivineLight() {
  return (
    <div className="divine-light" aria-hidden="true">
      <div className="divine-light__glow divine-light__glow--left" />
      <div className="divine-light__glow divine-light__glow--right" />
      <div className="divine-light__rays divine-light__rays--left" />
      <div className="divine-light__rays divine-light__rays--right" />
      <div className="divine-light__veil" />
    </div>
  );
}
