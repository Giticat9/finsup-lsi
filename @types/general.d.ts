export type ClassProperties<Class> = {
    [Key in keyof Class as Class[Key] extends Function ? never : Key]: Class[Key]
}

export type CapitalizedClassProperties<Class> = Record<Capitalize<keyof ClassProperties<Class>>, string>;