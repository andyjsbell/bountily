export const currentDateTimeISO = () => {
    return new Date().toISOString()
}

export const formatDateTime = (isoDate) => {
    return new Date(isoDate).toLocaleString()
}