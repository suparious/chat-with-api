import React from 'react'
import { createContext, useContext, useReducer, useEffect } from 'react'

// Define the context
const QueryContext = createContext()

// Action types
const actionTypes = {
  SET_QUERY: 'SET_QUERY',
  SET_RESULTS: 'SET_RESULTS',
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED'
}

// Initial state for the context
const initialState = {
  query: '',
  results: null,
  error: '',
  loading: false,
  isAuthenticated: false // Initial state for authentication
}

// Reducer function to manage the state
function queryReducer (state, action) {
  switch (action.type) {
    case actionTypes.SET_QUERY:
      console.log(`Setting query: ${action.payload}`)
      return { ...state, query: action.payload }
    case actionTypes.SET_RESULTS:
      console.log('Setting results: ', action.payload)
      return { ...state, results: action.payload }
    case actionTypes.SET_ERROR:
      console.error(`Setting error: ${action.payload}`)
      return { ...state, error: action.payload }
    case actionTypes.SET_LOADING:
      console.log(`Setting loading: ${action.payload}`)
      return { ...state, loading: action.payload }
    case actionTypes.SET_AUTHENTICATED:
      console.log(`Setting authentication status: ${action.payload}`)
      return { ...state, isAuthenticated: action.payload }
    default:
      return state
  }
}

// Custom hook to use the context
export function useQuery () {
  return useContext(QueryContext)
}

// Provider component
export function QueryProvider ({ children }) {
  const [state, dispatch] = useReducer(queryReducer, initialState, () => {
    // Check if the code is running in a browser environment
    const isBrowser = typeof window !== 'undefined'
    // Check if the user is authenticated when the app is first loaded
    const isAuthenticated = isBrowser ? localStorage.getItem('isAuthenticated') === 'true' : false
    return { ...initialState, isAuthenticated }
  })

  // Persist authentication state to localStorage on change
  useEffect(() => {
    // Check if the code is running in a browser environment
    const isBrowser = typeof window !== 'undefined'
    if (isBrowser) {
      localStorage.setItem('isAuthenticated', state.isAuthenticated)
    }
  }, [state.isAuthenticated])

  // Actions
  const setQuery = query => dispatch({ type: actionTypes.SET_QUERY, payload: query })
  const setResults = results => dispatch({ type: actionTypes.SET_RESULTS, payload: results })
  const setError = error => dispatch({ type: actionTypes.SET_ERROR, payload: error })
  const setLoading = loading => dispatch({ type: actionTypes.SET_LOADING, payload: loading })
  const setAuthenticated = isAuthenticated => dispatch({ type: actionTypes.SET_AUTHENTICATED, payload: isAuthenticated })

  return (
        <QueryContext.Provider value={{ ...state, setQuery, setResults, setError, setLoading, setAuthenticated }}>
            {children}
        </QueryContext.Provider>
  )
}
