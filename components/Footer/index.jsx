import { Label as LabelIcon, Twitter as TwitterIcon, Instagram as InstagramIcon, Telegram as TelegramIcon } from '@material-ui/icons'
import styles from '../../styles/Footer.module.css'

function Footer() {
    return <div className={styles.content}>
        <div className={styles.wrapper}>
            <div className={styles.groups}>
                <div className={styles.group}>
                    <span className={styles.title}><LabelIcon style={{width: 24, height: 24, color: 'white', marginRight: 6}} />IMPORTANTE</span>
                    <ul>
                        <li><a href="https://bscscan.com/address/0x4c79b8c9cb0bd62b047880603a9decf36de28344#code" target="_blank" className={styles.link}>📙 Contrato</a></li>
                        <li><a href="https://bscscan.com/tx/0x651ad1045e82872f5acdc6c2f13881ca89cae4bc84e30030ac198ad619ce4f0c" target="_blank" className={styles.link}>💰 Liquidez inicial trancada</a></li>
                        <li><a href="https://bscscan.com/tx/0xf238758aa8fba04338476497a6a9b6e09de114e669e7c14fcfbb8e788b78c554" target="_blank" className={styles.link}>🙋 Renúncia da liderança do token</a></li>
                        <li><a href="https://bscscan.com/tx/0x14e16df3172826bbfe0dad1304b5955ccdf3860f938795d43fd493cdefa277f4" target="_blank" className={styles.link}>🔥 50% do suprimento enviado ao "blackhole"</a></li>
                        <li><a href="https://linktr.ee/viralatafinance" target="_blank" className={styles.link}>🐶 Viralata-Finance Linktr.ee</a></li>
                    </ul>
                </div>
                <div className={styles.group}>
                    <span className={styles.title}><LabelIcon style={{width: 24, height: 24, color: 'white', marginRight: 6}} />COPYRIGHT</span>
                    <ul>
                        <blockquote>
                            Este é um site sem vínculo algum com o Projeto Oficial do $REAU - VIRA-LATA FINANCE! Nosso único objetivo é prover informação atualizada e facilitada da cotação atual!
                        </blockquote>
                    </ul>
                </div>
            </div>
            <div className={styles.image}>
                <span>
                    <a href="https://br.viralata.finance" target="_blank" />
                </span>
            </div>
            <div className={styles.social}>
                <a href="https://twitter.com/viralatafinance" target="_blank"><TwitterIcon className={styles.icon} /></a>
                <a href="https://t.me/viralatafinance" target="_blank"><TelegramIcon className={styles.icon} /></a>
                <a href="https://www.instagram.com/viralatafinance/" target="_blank"><InstagramIcon className={styles.icon} /></a>
            </div>
            <div className={styles.links}>
                <a href="https://br.viralata.finance" target="_blank">viralata finance</a>
                <a href="https://bscscan.com/address/0x4c79b8c9cb0bd62b047880603a9decf36de28344" target="_blank">bscscan address</a>
            </div>
        </div>
    </div>
}

export default Footer