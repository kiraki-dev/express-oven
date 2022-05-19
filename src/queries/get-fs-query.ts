import { AndQuery, OrQuery, Operation, OperationKeywords } from "./query";

export const getFsQueriedData = (data: Array<any>, query: AndQuery | OrQuery) => {
    if (Array.isArray(query)) {
        const filteredData = getOrQueriedData(data, query);;
        return Array.from(new Set(filteredData));
    } else {
        const filteredData = getAndQueriedData(data, query)
        return Array.from(new Set(filteredData));
    }
}

const getAndQueriedData = (data: any, query: AndQuery) => {
    let filteredData = data
    for (const [prop, rightObj] of Object.entries(query)) {
        if (filteredData.length === 0) {
            return filteredData;
        }
        if (prop === OperationKeywords.Or) {
            getOrQueriedData(data, rightObj);
        } else if (prop === OperationKeywords.And) {
            filteredData = getAndQueriedData(filteredData, rightObj);
        } else {
            filteredData = filteredData.filter(
                (item: any) => getOperationResult(rightObj.operation, item[prop], rightObj.paramValue)
            )
        }
    }
    return filteredData;
}

// only one layer of OR is alloweed for V2 first release
const getOrQueriedData = (data: any, query: OrQuery) => {
    let filteredData = [] as any[];
    for (const andQuery of query) {
        filteredData = [...filteredData, ...getAndQueriedData(data, andQuery)];
    }
    return filteredData;
}

export const getOperationResult = (operation: Operation, left: any, right: any): boolean => {
    if (operation === Operation.Equal) {
        return left == right;
    } else if (operation === Operation.GreaterThan) {
        return left > right;
    } else if (operation === Operation.GreaterThanOrEqual) {
        return left >= right;
    } else if (operation === Operation.SmallerThan) {
        return left < right;
    } else if (operation === Operation.SmallerThanOrEqual) {
        return left <= right;
    } else if (operation === Operation.NotEqual) {
        return left != right;
    } else if (operation === Operation.ArrayContains) {
        return left.includes(right);
    } else if (operation === Operation.ArrayContainsAny) {
        return left.some((r: any) => right.includes(r));
    } else if (operation === Operation.In) {
        return right.includes(left);
    } else if (operation === Operation.NotIn) {
        return !right.includes(left);
    }
    return false;
}