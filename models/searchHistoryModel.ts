import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"

type Address = {
  label: string
}

type AutoSuggestion = {
  id: string
  address: Address
}

type SearchValue = string | AutoSuggestion

export type SearchHistoryItem = {
  uid: string
  id?: string
  address: Address
  timestamp: number
}

const STORAGE_KEY = "store_search_history"

export const getSearchHistory = async (): Promise<SearchHistoryItem[]> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    return value != null ? JSON.parse(value) : []
  } catch (e) {
    console.error("Error retrieving search history", e)
    return []
  }
}

const transformSearchValue = (search: SearchValue): SearchHistoryItem => {
  const timestamp = Date.now()
  const uid = uuidv4()

  if (typeof search === "string") {
    return {
      uid,
      id: null,
      address: {
        label: search,
      },
      timestamp,
    }
  } else {
    return {
      uid,
      id: search.id,
      address: {
        label: search.address.label
      },
      timestamp,
    }
  }
}

export const setSearchHistory = async (search: SearchValue): Promise<void> => {
  try {
    const newItem = transformSearchValue(search)
    const currentHistory = await getSearchHistory()

    const updatedHistory = currentHistory.filter((item) => {
      if (newItem.id) {
        return item.id !== newItem.id
      } else {
        return (
          item.address.label.toLowerCase() !==
          newItem.address.label.toLowerCase()
        )
      }
    })

    updatedHistory.unshift(newItem)

    const value = JSON.stringify(updatedHistory)
    await AsyncStorage.setItem(STORAGE_KEY, value)
  } catch (e) {
    console.error("Error saving search history", e)
  }
}

export const deleteSearchHistory = async (uid: string): Promise<void> => {
  try {
    const currentHistory = await getSearchHistory();

    const updatedHistory = currentHistory.filter((item) => item.uid !== uid);

    const value = JSON.stringify(updatedHistory);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  } catch (e) {
    console.error('Error deleting search history item', e);
  }
};

export const sortHistoryByTimestamp = (
  history: SearchHistoryItem[]
): SearchHistoryItem[] => {
  return history.sort((a, b) => b.timestamp - a.timestamp)
}