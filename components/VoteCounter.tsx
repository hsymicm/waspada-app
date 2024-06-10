import { View, Text, StyleSheet } from "react-native"
import StyledIconButton from "./StyledIconButton"
import React, { useEffect, useState } from "react"
import { Colors } from "../themes/Colors"
import { formatRatingCounter } from "../libs/utils"
import {
  ChevronUpIcon as UpVoteIcon,
  ChevronDownIcon as DownVoteIcon,
} from "react-native-heroicons/solid"
import { checkVoteStatus, handleVote } from "../models/reportModel"

interface VoteCounterProps {
  card?: boolean,
  reportId: string | any,
  rating: number,
  userId: string,
  onUpdate?: any,
}

export default function VoteCounter({ card, reportId, rating, userId, onUpdate }: VoteCounterProps) {
  const [currentVote, setCurrentVote] = useState(0)
  const [displayedRating, setDisplayedRating] = useState(rating ?? 0)

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const status = await checkVoteStatus(reportId, userId)
        if (status === "upvoted") {
          setCurrentVote(1)
        } else if (status === "downvoted") {
          setCurrentVote(-1)
        } else {
          setCurrentVote(0)
        }
      } catch (error) {
        console.error("Error fetching vote status: ", error)
      }
    }

    if (userId && rating !== null) {
      setDisplayedRating(rating)
      fetchVoteStatus()
    }
  }, [rating, userId])

  const handleVoteSubmit = async (voteValue: 1 | 0 | -1) => {
    if (!userId) throw new Error("Invalid auth")

    try {
      let newVoteValue = voteValue

      if (currentVote === voteValue) {
        newVoteValue = 0
      }

      await handleVote({ reportId, userId, voteValue: newVoteValue })
      setCurrentVote(newVoteValue)

      setDisplayedRating((prevRating: number | null) => {
        const adjustedRating = (prevRating) - currentVote + newVoteValue
        return adjustedRating
      })

      onUpdate
    } catch (error) {
      console.error("Error submitting vote: ", error)
    }
  }

  return (
    <View style={card ? styles.voteContainerCard : styles.voteContainer}>
      <StyledIconButton
        onPress={() => handleVoteSubmit(1)}
        style={
          currentVote === 1
            ? { backgroundColor: Colors.success.color, padding: 4 }
            : { padding: 4 }
        }
        variant="secondary"
        width={24}
      >
        <UpVoteIcon
          size={18}
          color={currentVote === 1 ? Colors.white : Colors.primaryDark}
        />
      </StyledIconButton>
      <Text
        style={[
          card ? styles.voteContainerCard : styles.voteCounter,
          currentVote !== 0 && { fontFamily: "Nunito-Bold" },
        ]}
      >
        {formatRatingCounter(displayedRating ?? 0)}
      </Text>
      <StyledIconButton
        onPress={() => handleVoteSubmit(-1)}
        style={
          currentVote === -1
            ? { backgroundColor: Colors.error.color, padding: 4 }
            : { padding: 4 }
        }
        variant="secondary"
        width={24}
      >
        <DownVoteIcon
          size={18}
          color={currentVote === -1 ? Colors.white : Colors.primaryDark}
        />
      </StyledIconButton>
    </View>
  )
}

const styles = StyleSheet.create({
  voteContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 8,
  },

  voteCounter: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.white,
  },

  voteContainerCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  voteCounterCard: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: Colors.black,
  },
})
