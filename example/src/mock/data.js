let obj = {
    first: '香蕉香蕉香蕉香蕉',
    second: '苹果🍎🍎🍎🍎🍎🍎',
    third: '芒果🥭'
}
let data = Array.from({ length: 10 }).map((item, i) => {
    let { first, second, third } = obj
    return {
        first: first + i,
        second: second + i,
        third: third + i
    }
})
export default data