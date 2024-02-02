import React from 'react';

export function composeHOCs(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

export const withContext = (Context, propKey) => (NextComponent) => (
    (ps) => {
        var { [propKey]: value, ...rest } = ps;
        return (
            <Context.Provider value={ value }>
                <NextComponent { ...rest }/>
            </Context.Provider>
        )
    }
)

export const composeAsComponent = (...args) => (
    composeHOCs(...args)(
        ({ children }) => children
    )
)
