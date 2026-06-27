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
                    <span className={styles.cardIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <h2 className={styles.cardTitle}>A escola</h2>
                    <p className={styles.cardText}>
                        O JANotifica foi desenvolvido para a <strong>Escola João Alves</strong>,
                        uma instituição de ensino fundamental I e II. O sistema nasceu de uma
                        necessidade real da coordenação: reduzir o tempo gasto com
                        mensagens manuais para avisar responsáveis sobre faltas dos alunos.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </span>
                    <h2 className={styles.cardTitle}>O problema</h2>
                    <p className={styles.cardText}>
                        A secretaria já registrava as faltas em planilhas do Google Sheets,
                        mas a comunicação com os responsáveis era feita manualmente — um processo
                        lento, sujeito a esquecimentos e que consumia tempo da equipe todos os dias.
                        O JANotifica automatiza esse fluxo do começo ao fim.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </span>
                    <h2 className={styles.cardTitle}>A solução</h2>
                    <p className={styles.cardText}>
                        O sistema lê a planilha automaticamente, identifica cada falta registrada
                        e dispara uma mensagem de WhatsApp para o responsável em poucos segundos.
                        A secretaria continua trabalhando do jeito que já trabalhava — o JANotifica
                        cuida do resto.
                    </p>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
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
            <div className={styles.contacts}>
                <h1 className={styles.contactsTitle}>Contato</h1>
                <p className={styles.contactsText}>
                    Para dúvidas, sugestões ou parcerias, entre em contato comigo:
                </p>
                <div className={styles.contactButtons}>
                    <a href="mailto:l3renovalentim@gmail.com" className={styles.contactButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M22 4L12 13 2 4" />
                        </svg>
                        Enviar email
                    </a>
                    <a href="https://www.linkedin.com/in/breno-v/" target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                    </a>
                </div>
            </div>

        </div>
    );
}