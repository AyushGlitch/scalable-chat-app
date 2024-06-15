export const errorHandler= (status: number, message: string) => {
    const error= new Error(message)
    error.name= `${status} Error`
    return error
}