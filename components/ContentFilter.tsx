import {
  ScrollView,
  View,
  StyleSheet,
  Modal,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native"
import {
  CalendarIcon,
  XMarkIcon,
} from "react-native-heroicons/solid"
import StyledButton from "./StyledButton"
import { Colors } from "../themes/Colors"
import { router, useLocalSearchParams } from "expo-router"
import CalendarPicker from "react-native-calendar-picker"
import { useState } from "react"
import { formatTimestamp } from "../libs/utils"

export default function ContentFilter({}) {
  const { _filter, _search } = useLocalSearchParams()
  const [date, setDate] = useState(null)
  const [displayDate, setDisplayDate] = useState(null)
  const [dateModalVisible, setDateModalVisible] = useState(false)

  const handleSubmitDate = () => {
    setDateModalVisible(false)
    setDisplayDate(date)
  }

  const handleResetDate = () => {
    if (displayDate) {
      setDisplayDate(null)
      setDateModalVisible(false)
    }
    setDate(null)
  }

  return (
    <>
      <Modal
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(!dateModalVisible)}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setDateModalVisible(false)}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00000064",
            }}
          >
            <TouchableWithoutFeedback touchSoundDisabled>
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 16,
                  paddingTop: 16,
                }}
              >
                <CalendarPicker
                  height={Dimensions.get("window").height - 31}
                  width={Dimensions.get("window").width - 31}
                  onDateChange={(date) => setDate(date)}
                  selectedStartDate={date}
                  weekdays={["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]}
                  months={[
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                  ]}
                  selectMonthTitle="Pilih Bulan di Tahun "
                  selectYearTitle="Pilih Tahun"
                  previousTitle="Sebelum"
                  nextTitle="Selanjutnya"
                  textStyle={{
                    fontFamily: "Nunito-Regular",
                    color: Colors.black,
                  }}
                  todayBackgroundColor={Colors.lightGray}
                  todayTextStyle={{ color: Colors.black }}
                  selectedDayColor={Colors.accent}
                  selectedDayTextColor={Colors.white}
                  showDayStragglers
                  monthTitleStyle={styles.monthYearStyle}
                  yearTitleStyle={styles.monthYearStyle}
                />
                <View style={{ display: "flex", padding: 16, gap: 8 }}>
                  <StyledButton
                    title="Pilih Tanggal"
                    style={{ width: "100%" }}
                    onPress={handleSubmitDate}
                  />
                  {date && (
                    <StyledButton
                      title="Reset Tanggal"
                      style={{ width: "100%" }}
                      variant="secondary"
                      onPress={handleResetDate}
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setDateModalVisible(false)}
            >
              <View
                style={{
                  display: "flex",
                  padding: 16,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Regular",
                    fontSize: 16,
                    color: "#F5F6FBCA",
                  }}
                >
                  Tekan area kosong untuk keluar
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <StyledButton
            title="Terdekat"
            onPress={() => router.setParams({ _filter: "near", _search: "" })}
            variant={
              (_filter === "near" || !_filter) && (_search === "" || !_search)
                ? "primary"
                : "secondary"
            }
            size="small"
          />
          <StyledButton
            title="Populer"
            onPress={() => router.setParams({ _filter: "popular" })}
            variant={_filter === "popular" ? "primary" : "secondary"}
            size="small"
          />
          <StyledButton
            title="Semua"
            onPress={() => router.setParams({ _filter: "all" })}
            variant={_filter === "all" ? "primary" : "secondary"}
            size="small"
          />
          <StyledButton
            title={displayDate ? `Tanggal ${formatTimestamp(displayDate, false)}` : "Filter Tanggal"}
            variant={displayDate ? "primary" : "secondary"}
            size="small"
            onPress={() => setDateModalVisible(true)}
            iconRight={displayDate && <XMarkIcon size={16} color={Colors.white} />}
            iconLeft={!displayDate && <CalendarIcon size={16} color={Colors.primaryDark} />}
            style={[displayDate ? {paddingRight: 12, paddingLeft: 14} : {paddingRight: 14, paddingLeft: 12}, { gap: 6 }]}
          />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  monthYearStyle: {
    backgroundColor: Colors.lightGray,
    color: Colors.black,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
})
