import styles from './Footer.module.css'; 

function Footer() {
  // Aca colocamos los datos de mail de cada area
  const equipo = [
    { id: 1, email: 'sertec@miferreteria.com', rol: 'Soporte Tecnico' },
    { id: 2, email: 'ventas@miferreteria.com', rol: 'Ventas' },
    { id: 3, email: 'logística@miferreteria.com', rol: 'Envíos y Despacho' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.infoEmpresa}>
        <p>© 2026 Ferretería Industrial. Propiedad Intelectual Reservada.</p>
        <p>Contacto: info@miferreteria.com | Sedes: Buenos Aires, Córdoba</p>
        <p>Políticas de Privacidad | Términos y Condiciones</p>
      </div>
      
      <div className={styles.tarjetasEquipo}>
        {equipo.map(persona => (
          <div key={persona.id} className={styles.tarjeta}>
            <h4>{persona.email}</h4>
            <p>{persona.rol}</p>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
