export default function ImpressumPage() {
  const note = { fontSize: 13, color: '#9A8DB8' };
  return (
    <section className="page visible">
      <div className="page-hero"><div className="wrap"><h1>Impressum</h1></div></div>
      <div className="section"><div className="wrap legal-body">

        <h2>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</h2>
        <p>
          <strong>Diensteanbieter / Träger:</strong><br />
          Volksbildungswerk Klarenthal e.V.<br />
          Geschwister-Scholl-Straße 10<br />
          65197 Wiesbaden
        </p>
        <p>
          Diese Webseite wird vom Volksbildungswerk Klarenthal e.V. als Träger der
          überparteilichen Initiative „Klarenthal lebt Demokratie“ — Runder Tisch für
          Demokratieförderung — betrieben.
        </p>

        <h2>Vertreten durch</h2>
        <p>Der Vorstand des Volksbildungswerk Klarenthal e.V. <span style={note}>[vollständige Namen der vertretungsberechtigten Vorstandsmitglieder ergänzen]</span></p>

        <h2>Kontakt</h2>
        <p>
          Telefon: 0611 724 379 20<br />
          E-Mail: Dein_Gesicht_fuer_Demokratie@web.de<br />
          Web: www.klarenthal.org
        </p>

        <h2>Registereintrag</h2>
        <p>
          Eintragung im Vereinsregister.<br />
          Registergericht: Amtsgericht Wiesbaden<br />
          Registernummer: VR <span style={note}>[Vereinsregisternummer ergänzen]</span>
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>Sabine Betz, Runder Tisch „Klarenthal lebt Demokratie“ — Anschrift wie oben.</p>

        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit: <span style={{ wordBreak: 'break-all' }}>https://ec.europa.eu/consumers/odr/</span>.
          Unsere E-Mail-Adresse finden Sie oben.
        </p>

        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen
          Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir
          als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
          Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
          konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen
          werden wir diese Inhalte umgehend entfernen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
          übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
          Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir
          derartige Links umgehend entfernen.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die
          Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
          bzw. Erstellers.
        </p>

        <p style={note}>
          Hinweis: Dies ist eine rechtskonforme Vorlage. Die mit [Klammern] markierten Pflichtangaben
          (Vorstandsnamen, Vereinsregisternummer) sind durch die Initiative zu ergänzen und vor
          Veröffentlichung durch das Volksbildungswerk Klarenthal e.V. final zu prüfen.
        </p>

      </div></div>
    </section>
  );
}
