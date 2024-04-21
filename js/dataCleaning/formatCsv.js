function formatCsv(results) {
    const refinedData = []
    const titleKeys = Object.keys(results[0][0]);

    refinedData.push(titleKeys);

    results.forEach(el => {
        el.forEach(la => {
            refinedData.push(Object.values(la).join(','));
        })
    })

    return refinedData.join("\n");
}

module.exports = {
    formatCsv
}
