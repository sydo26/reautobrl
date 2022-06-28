import Head from 'next/head'
import Input from '../components/Input'
import { Refresh as RefreshIcon, FileCopy as FileCopyIcon, ArrowDownward as ArrowDownwardIcon, ArrowUpward as ArrowUpwardIcon } from '@material-ui/icons'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Checkbox from '../components/Checkbox'
import { Background, Parallax } from 'react-parallax';
import Card from '../components/Card'
import Table from '../components/Table'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import ReactGA from 'react-ga';
import axios from 'axios'
// import { useMultipleIntersects } from '../hooks'

import absoluteURL from 'next-absolute-url'

const timeoutUpdate = 2000
const intervalUpdate = 20000
const max = 1000000000000000 // 1 Quadrilhão

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const dexGuruAPI = axios.create({
  baseURL: 'https://api.dex.guru/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
  },
  timeout: 5000,
})

const economiaAPI = axios.create({
  baseURL: 'https://economia.awesomeapi.com.br/json',
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json"
  },
  timeout: 5000,
})

function Home({ data }) {

  // const { addIntersect, cleanIntersects } = useMultipleIntersects(0, ({target, isIntersecting, intersectionRatio }) => {
  //   if(isIntersecting) {
  //     // console.log(target)
  //     // target.style.transform = "translateY(0)"
  //   } else {
  //     // target.style = {}
  //     // console.log('remove', target)
  //   }
  // })

  const [width, setWidth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialValue, setInitialValue] = useState(1000000)
  const [fetching, setFetching] = useState(false)
  const [update, setUpdate] = useState(true)
  const [allTimeouts, setAllTimeouts] = useState([])
  const [controller, setController] = useState(null)
  const [toReal, setToReal] = useState(data?.toReal || 0)
  const [initialAllowAutomaticUpdate, setInitialAllowAutomaticUpdate] = useState(false)
  const [lastUpdate, setLastUpdate] = useState("")
  const [messageAlert, setMessageAlert] = useState({ open: false, message: "", status: "success" })

  const [current, setCurrent] = useState(0) // 0 = reau, 1 = brl

  const reauRef = useRef(null)
  const brlRef = useRef(null)
  const checkboxRef = useRef(null)

  const handleFormatNumber = (number, dec, dsep, tsep) => {
    if (isNaN(number) || number == null) return '';

    number = parseFloat(number).toFixed(~~dec);
    tsep = typeof tsep == 'string' ? tsep : ',';

    var parts = number.split('.'),
      fnums = parts[0],
      decimals = parts[1] ? (dsep || '.') + parts[1] : '';

    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
  }

  const dateToString = (timestamp) => {
    const date = new Date(timestamp)
    return `${("00" + date.getDate()).slice(-2)}/${("00" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${('00' + date.getHours()).slice(-2)}:${('00' + date.getMinutes()).slice(-2)}:${('00' + date.getSeconds()).slice(-2)}`
  }

  const handleUpdateToReal = (signal, force = false) => {
    console.log("Update:", update)
    console.log("Fetching:", update)
    if (update && !fetching) {
      if (!force) {
        setUpdate(_ => {
          const timeout = setTimeout(() => {
            setUpdate(true)
          }, timeoutUpdate)
          setAllTimeouts(c => [...c, timeout])

          return false
        })
      }
      setFetching(true)
      fetch('/api/values', { signal }).then(value => value.json()).then(json => {
        if (json.toReal) {
          if (json.toReal !== toReal) {
            setLastUpdate(dateToString(Date.now()))
          }

          setToReal(json.toReal)
        } else {
          console.log("ERROR")
          updateInClient()
        }
        

      }).catch(err => {
        console.log(err)
      }).finally(() => {
        setFetching(false)
      })
      
    }
  }

  useEffect(() => {

    ReactGA.initialize('UA-193824824-1');
    ReactGA.pageview(window.location.pathname + window.location.search);


    setWidth(window.innerWidth)
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    setLastUpdate(dateToString(Date.now()))
    const valueStorage = localStorage.getItem('value')
    const automaticUpdateStorage = localStorage.getItem('automaticUpdate')
    if (valueStorage && !isNaN(valueStorage)) {
      setInitialValue(parseFloat(valueStorage))
    } else {
      localStorage.setItem('value', initialValue)
    }

    if (automaticUpdateStorage) {
      setInitialAllowAutomaticUpdate(JSON.parse(automaticUpdateStorage))
    } else {
      localStorage.setItem('automaticUpdate', initialAllowAutomaticUpdate)
    }

    const c = new AbortController()
    setController(c)
    const interval = setInterval(() => {
      if (checkboxRef.current?.checked) {
        handleUpdateToReal(c.signal)
      }
    }, intervalUpdate);

    if (toReal === 0) {
      updateInClient()

      // const dataStorage = localStorage.getItem('data')
      // if (dataStorage) {
      //   setToReal(JSON.parse(dataStorage).toReal)
      // }
    }


    // [...document.querySelectorAll('.animate_show')].forEach(element => addIntersect(element))


    setLoading(false)
    return () => {
      // cleanIntersects()
      setMessageAlert({ open: false, message: "", status: 'success' })
      setLastUpdate("")
      setInitialValue(1000000)
      setFetching(false)
      setToReal(data?.toReal || 0)
      setCurrent(0)
      clearInterval(interval)
      c.abort()
      setUpdate(true)
      allTimeouts.forEach(x => {
        clearTimeout(x)
      })
      setAllTimeouts([])
      setLoading(true)
    }
  }, [])


  useEffect(() => {
    console.log(toReal)
    if (toReal) {
      localStorage.setItem('data', JSON.stringify({
        toReal
      }))
    }
    handleChange(current === 0 ? reauRef.current?.value : brlRef.current?.value)
  }, [toReal])

  const handleChange = (value, v) => {
    if (current === 0 || v === 0) {
      brlRef.current?.setValue(toReal * value)
      localStorage.setItem('value', value)
    } else {
      reauRef.current?.setValue(value / toReal)
      localStorage.setItem('value', value / toReal)
    }
  }

  const forceUpdate = async () => {
    if (update && !fetching) {
      handleUpdateToReal(controller.signal, true)
      setUpdate(_ => {
        const timeout = setTimeout(() => {
          setUpdate(true)
        }, timeoutUpdate)
        setAllTimeouts(c => [...c, timeout])

        return false
      })
    }

  }

  const copyValue = (value) => {
    const textarea = document.createElement('textarea')
    textarea.textContent = value
    textarea.style.position = 'fixed'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, 99999)

    if (document.execCommand('copy')) {
      handleSendMessageAlert("Token copiado!")
    } else {
      handleSendMessageAlert("Falha ao tentar copiar!", 'error')
    }

    document.body.removeChild(textarea)
  }

  const handleSendMessageAlert = (message, status = "success") => {
    setMessageAlert({
      message,
      open: true,
      status
    })
  }

  

  const updateInClient = () => {
    const token = "0x4c79b8c9cb0bd62b047880603a9decf36de28344-bsc"
    setFetching(true)
    dexGuruAPI.get(`tokens/${token}`).then(async ({ data: dex }) => {
      await economiaAPI.get(`/all/usd`).then(({ data: eco }) => {
        setToReal(dex.priceUSD * eco.USD.high)
        if(dex.priceUSD * eco.USD.high !== toReal) {setLastUpdate(dateToString(Date.now()))}
      }).catch(err => {

        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      setFetching(false)
    })

  }


  return (
    <Parallax strength={800}>

      <Snackbar open={messageAlert.open} autoHideDuration={4000} onClose={() => setMessageAlert(value => ({ ...value, open: false }))}>
        <Alert onClose={() => setMessageAlert(value => ({ ...value, open: false }))} severity="success">
          {messageAlert.message}
        </Alert>
      </Snackbar>
      <Background>
        <div className={styles.bg}></div>
      </Background>
      <div className={styles.container}>
        <Head>
          <title>$REAU em REAL: Cotação em tempo REAU. Valor e Preço!</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="url" content="https://colocarhost.com.br" />
          <meta name="title" content="$REAU em REAL: Cotação em tempo REAU. Valor e Preço!" />
          <meta name="description" content="O $REAU é uma criptomoeda meme brasileira criada pelo projeto Vira-lata Finance, o token do vira-lata caramelo foi desenvolvido em protocolo de finança descentralizada (DeFi, sigla em inglês). Com o famoso vira-lata caramelo de símbolo, a moeda também tem como objetivo ajudar instituições de auxílio a animais abandonados. O endereço da moeda é: 0x4c79b8c9cb0bd62b047880603a9decf36de28344" />
          <meta name="keywords" content="reauemreal,cotação,criptomoeda, 0x4c79b8c9cb0bd62b047880603a9decf36de28344, vira-lata, dog, cachorro, meme, vira-lata finances, moeda, conversão, converter, converta para, converta de, brl, reau, $reau" />
          <meta name="robots" content="all,noimageindex,noarchive,nocache,notranslate" />
          <meta name="author" content="Vinícius Roque (Sydo26) https://github.com/sydo26" />
          <meta name="developer" content="Vinícius Roque (Sydo26) https://github.com/sydo26" />
          <meta name="designer" content="Vinícius Roque (Sydo26) https://github.com/sydo26" />
          <meta name="designer" content="Vinícius Roque (Sydo26) https://github.com/sydo26" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://colocarhost.com.br/" />
          <meta property="og:title" content="$REAU em REAL: Cotação em tempo REAU. Valor e Preço!" />
          <meta property="og:description" content="A criptomoeda $REAU da Vira-lata finances, que o seu mascote é o cachorro do meme 'vira-lata caramelo'." />
          <meta property="og:image" content="//logo.png" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://colocarhost.com.br/" />
          <meta property="twitter:title" content="$REAU em REAL: Cotação em tempo REAU. Valor e Preço!" />
          <meta property="twitter:description" content="A criptomoeda $REAU da Vira-lata finances, que o seu mascote é o cachorro do meme 'vira-lata caramelo'." />
          <meta property="twitter:image" content="//logo.png" />
        </Head>

        <main className={styles.main}>
          <div className={styles.flexwrapper}>
            <div className={styles.wrapperimage}><a href="https://br.viralata.finance/" target="_blank" className={styles.image}></a></div>

            <span className={styles.caption} style={{ display: 'flex', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="disable-select" onClick={(e) => copyValue(e.target.textContent)}>
                <span>0x4c79b8c9cb0bd62b047880603a9decf36de28344</span>
                <FileCopyIcon style={{ width: 14, heigth: 14, marginLeft: 10, color: '#828282' }} />
              </span>
            </span>
          </div>
          <h1 className={styles.title}>REAU para BRL</h1>
          <div className={styles.coins}>
            <div className={styles.flex}>
              {!loading && <Input max={max} onFocus={() => setCurrent(0)} onValueChange={(value, force) => current === 0 && handleChange(value, force ? 0 : null)} ref={reauRef} stepValue={1000000} defaultValue={initialValue} prefix="$REAU" align="left" />}
              <span className={styles.compare}>{width <= 414 ? <ArrowDownwardIcon style={{ width: 32, height: 32 }} /> : 'VALE'}</span>
              {!loading && <Input max={max * toReal} onFocus={() => setCurrent(1)} onValueChange={(value, force) => current === 1 && handleChange(value, force ? 1 : null)} ref={brlRef} defaultValue={0} prefix="R$" align="right" suffix="Reais" />}
            </div>
            <div style={{ marginTop: 32 }} className={styles.flex}>
              <button onClick={forceUpdate} disabled={!update || fetching} className={styles.refresh}>
                <RefreshIcon style={{ width: 24, height: 24, color: '#333333', display: fetching && !update ? 'block' : (!update ? 'none' : 'block') }} />
                <label style={{ display: fetching && !update ? 'none' : (!update ? 'block' : 'none') }}>OK!</label>
                <span>Atualizar cotação</span>
              </button>
              {!loading && <Checkbox title={`Atualizar a cada ${intervalUpdate / 1000} segundos`} ref={checkboxRef} defaultChecked={initialAllowAutomaticUpdate} onChange={(v) => localStorage.setItem('automaticUpdate', v)} />}
            </div>
            <span className={styles.caption}>
              {toReal === 0 && (
                <span style={{color: 'red'}}>
                  <strong>ERRO!</strong> Não conseguimos pegar a cotação!
                  <br />
                </span>
              )}
              <strong>1 milhão</strong> de $REAU equivale a <strong>{(1000000 * toReal).toFixed(2)}</strong> REAIS
              <br />
              <strong>Última atualização</strong>: {lastUpdate}
              <br />
              <strong>Cotação</strong>: R$ {toReal}
            </span>
          </div>
          <div className="ad">
            <img src="https://d37p6u34ymiu6v.cloudfront.net/1-md5-4e8120231aca95c46e20104126bb6a0b.gif" alt="exemplo1"/>
          </div>
          <div className={styles.flex}>
            <Table toReal={toReal} />
          </div>
          <div className="ad">
            <img src="https://d37p6u34ymiu6v.cloudfront.net/1-md5-e306de677f3a5554936bd99e623b060e.png" alt="exemplo2" />
          </div>
          <div className={styles.flexwrapper}>
            <Card title="Cotação do $REAU">
              <span>
                A <strong>cotação</strong> do <strong>$REAU hoje</strong> está de R$ {handleFormatNumber(toReal * 1000000, 2, ',', '.')} para <strong>1 milhão de $REAU</strong>.
                A <strong>cotação do $REAU</strong> em nosso site, é atualizada pelos serviços da <a target="_blank" href="https://dex.guru/0x4c79b8c9cb0bd62b047880603a9decf36de28344-bsc">dex.guru</a>.
                </span>
            </Card>
            <Card title="Sobre o $REAU" align="right">
              <span>
                O <strong>$REAU</strong> é uma <strong>criptomoeda meme brasileira</strong> criada pelo projeto
                <a href="https://br.viralata.finance" target="_blank">Vira-lata Finance</a>, o token do <strong>vira-lata caramelo</strong>
                foi desenvolvido em protocolo de finança descentralizada (DeFi, sigla em inglês).
                Com o famoso <strong>vira-lata caramelo de símbolo</strong>, a moeda também tem como objetivo ajudar instituições de auxílio a animais abandonados.
              </span>
            </Card>
            <Card title="Como comprar $REAU?">
              <span>
                Você pode <strong>comprar $REAU</strong> na <a target="_blank" href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x4c79b8c9cB0BD62B047880603a9DEcf36dE28344">Pancakeswap</a> trocando suas moedas <strong>Smart Chain (BNB)</strong> por <strong>$REAU</strong>. Se preferir, você pode <strong>comprar $REAU</strong> diretamente na <a target="_blank" href="https://brasilbitcoin.com.br">Brasil Bitcoin</a> sem complicações.
              </span>
            </Card>
          </div>
          <div className="ad">
            <img src="https://d37p6u34ymiu6v.cloudfront.net/1-md5-5b341504c204c17defe520bde3fb8da9.jpg" alt="exemplo3" />
          </div>
        </main>

        <footer className={styles.footer}>
          <button className={styles.backtop} onClick={() => {
            window['scrollTo']({top:0,behavior: 'smooth'})
          }}><ArrowUpwardIcon /></button>
          <span className={styles.caption} style={{ display: 'flex', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="disable-select" onClick={(e) => copyValue(e.target.textContent)}>
              <span>0x4c79b8c9cb0bd62b047880603a9decf36de28344</span>
              <FileCopyIcon style={{ width: 14, heigth: 14, marginLeft: 10, color: '#828282' }} />
            </span>
          </span>
          <Footer />
        </footer>
      </div>
    </Parallax>)
}


export default Home
