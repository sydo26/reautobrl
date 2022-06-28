import styles from '../../styles/Table.module.css'

function Table({ toReal }) {

    const handleFormatNumber = (number, dec, dsep, tsep) => {
        if (isNaN(number) || number == null) return '';
      
        number = parseFloat(number).toFixed(~~dec);
        tsep = typeof tsep == 'string' ? tsep : ',';
      
        var parts = number.split('.'),
          fnums = parts[0],
          decimals = parts[1] ? (dsep || '.') + parts[1] : '';
      
        return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    }

    return (
        <div style={{width: '100%', height: 'auto', overflow: 'auto'}}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>$REAU</th>
                        <th>Real (BRL)</th>
                    </tr>
                </thead>
                <tbody>
                    {new Array(10).fill(0).map((_, index) => {
                        const value = Math.pow(10,(index + 1)) * 100000
                        let base = value/1000000
                        let suffix = ""
                        if(base == 1) suffix = 'Milhão'
                        else if(base > 1 && base < 1000) suffix = 'Milhões'
                        else if(base === 1000) {
                            suffix = 'Bilhão'
                            base /= 1000
                        }
                        else if(base > 1000 && base < 1000000) {
                            suffix = 'Bilhões'
                            base /= 1000
                        } else if(base >= 1000000 && base < 1000000000) {
                            suffix = 'Trilhões'
                            base /= 1000000
                        }
                        else if(base >= 1000000000 ) {
                            suffix = 'Quadrilhão'
                            base /= 1000000000
                        }

                        return (
                            <tr key={'tr_'+index}>
                                <td>$REAU {handleFormatNumber(value, 2, ',', '.')} ({base} {suffix})</td>
                                <td>R$ {handleFormatNumber(toReal * value, 4, ',', '.')}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}


export default Table