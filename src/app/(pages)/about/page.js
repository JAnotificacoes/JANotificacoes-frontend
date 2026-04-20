import styles from "./about.module.css";

export default function AboutPage() {
    return (
        <div className={styles.container}>

            {/* Hero */}
            <div className={styles.hero}>
                <h1 className={styles.title}>Sobre o JANotifica</h1>
                <p className={styles.subtitle}>
                    Um sistema criado por um ex-aluno, para a escola que o formou.
                </p>
            </div>

            {/* Cards */}
            <div className={styles.grid}>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>🏫</span>
                    <h2 className={styles.cardTitle}>A escola</h2>
                    <p className={styles.cardText}>
                        O JANotifica foi desenvolvido para a <strong>Escola João Alves</strong>,
                        uma instituição de ensino fundamental I e II. O sistema nasceu de uma
                        necessidade real da coordenação: reduzir o tempo gasto com
                        mensagens manuais para avisar responsáveis sobre faltas dos alunos.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>⚡</span>
                    <h2 className={styles.cardTitle}>O problema</h2>
                    <p className={styles.cardText}>
                        A secretaria já registrava as faltas em planilhas do Google Sheets,
                        mas a comunicação com os responsáveis era feita manualmente — um processo
                        lento, sujeito a esquecimentos e que consumia tempo da equipe todos os dias.
                        O JANotifica automatiza esse fluxo do começo ao fim.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>🛠️</span>
                    <h2 className={styles.cardTitle}>A solução</h2>
                    <p className={styles.cardText}>
                        O sistema lê a planilha automaticamente, identifica cada falta registrada
                        e dispara uma mensagem de WhatsApp para o responsável em poucos segundos.
                        A secretaria continua trabalhando do jeito que já trabalhava — o JANotifica
                        cuida do resto.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>👨‍💻</span>
                    <h2 className={styles.cardTitle}>O desenvolvedor</h2>
                    <p className={styles.cardText}>
                        <strong>Breno Valentim</strong> é ex-aluno da Escola João Alves e tinha 17 anos
                        quando desenvolveu este projeto. Na época, cursava Desenvolvimento de
                        Sistemas no <strong>Centro Paula Souza — Colégio Bento Quirino</strong>.
                        O JANotifica foi sua forma de retribuir à escola um pouco do que ela
                        construiu nele.
                    </p>
                </div>

            </div>

            {/* Stack */}
            <div className={styles.stack}>
                <h2 className={styles.stackTitle}>Tecnologias utilizadas</h2>
                <div className={styles.tags}>
                    {[
                        "Python", "FastAPI", "PostgreSQL", "SQLAlchemy",
                        "Google Sheets API", "Evolution API", "WhatsApp",
                        "Docker", "Next.js",
                    ].map((tech) => (
                        <span key={tech} className={styles.tag}>{tech}</span>
                    ))}
                </div>
            </div>

            {/*Contatos*/}
            {/* <div className={styles.contacts}>
                <h1 className={styles.contactsTitle}><span role="img" aria-label="Envelope">📫</span> Contato</h1>
                <p className={styles.contactsText}>
                    Para dúvidas, sugestões ou parcerias, entre em contato comigo:
                </p>
                <ul className={styles.contactList}>
                    <li><strong>Email:</strong></li>
                    <a href="mailto:l3renovalentim@gmail.com">l3renovalentim@gmail.com</a>
                    <li><strong>Linkedin:</strong></li>
                    <a href="https://www.linkedin.com/in/breno-v/" target="_blank" rel="noopener noreferrer">
                        Breno-V
                    </a>
                </ul>
            </div> */}

        </div>
    );
}