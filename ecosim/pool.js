const Pool = module.exports.Pool = {}

Pool.getRandomPool = module.exports.getRandomPool = function getRandomPool (entities, length = Math.floor(Math.random() * 10)) {
    return length
        ? Array(length)
            .fill()
            .reduce((acc) => {
                acc[Math.floor(Math.random() * entities)] = Math.floor(Math.random() * 10 + 1)
                return acc
            }, {})
        : {}
}

Pool.count = function count (multiset, container) {
    const entities = Object.keys(multiset)
    return entities.length
        ? entities.reduce((acc, entity) => {
            return multiset[entity] > 0
                ? Math.min(acc, Math.floor((container[entity] || 0) / multiset[entity]))
                : acc
        }, Infinity)
        : 0
}

Pool.add = function add (pool1, pool2) {
    const result = { ...pool1 }
    const types2 = Object.keys(pool2)

    for (let i = 0; i < types2.length; i++) {
        result[types2[i]] = (result[types2[i]] || 0) + pool2[types2[i]]
    }

    return result
}

Pool.subtract = function subtract (minuend, subtrahend) {
    const difference = { ...minuend }
    const types2 = Object.keys(subtrahend)

    for (let i = 0; i < types2.length; i++) {
        if (!(types2[i] in difference)) {
            return false
        }
        const diff = difference[types2[i]] - subtrahend[types2[i]]
        if (diff > 0) {
            difference[types2[i]] = diff
        } else if (diff === 0) {
            delete difference[types2[i]]
        } else {
            return false
        }
    }

    return difference
}
