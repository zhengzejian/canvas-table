
interface Config {
    width: number;
    height: number;
    lineColor: string;
    headerColor: string;
    headerHeight: number,
    rowHeight: number;
    cellPaddingWidth: number;
    font: string;
    fontSize: number;
}
const config: Config = {
    width: 1200,
    height: 1200,
    lineColor: '#d2d2d6',
    headerColor: '#ebecf0',
    headerHeight: 32,
    rowHeight: 28,
    cellPaddingWidth: 6,
    font: 'bold 13px Microsoft YaHei',
    fontSize: 13
}
export default config