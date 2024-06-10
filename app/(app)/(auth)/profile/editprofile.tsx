import { ScrollView, View, Text, Image, StyleSheet } from "react-native"
import { Colors } from "../../../../themes/Colors"
import { useEffect, useState } from "react"
import { getUserProfile } from "../../../../models/profileModel"
import { useAuth } from "../../../../contexts/AuthContext"
import { TouchableOpacity } from "react-native-gesture-handler"
import { PhotoIcon, PencilSquareIcon } from "react-native-heroicons/solid"
import TextInputField from "../../../../components/TextInputField"
import { formatTimestamp } from "../../../../libs/utils"
import StyledButton from "../../../../components/StyledButton"
import { Shadow } from "react-native-shadow-2"
import TextSkeleton from "../../../../components/Skeleton/TextSkeleton"
import * as ImagePicker from "expo-image-picker"

export default function EditProfile() {
  const [profile, setProfile] = useState(null)
  const [editProfile, setEditProfile] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [result, setResult] = useState(null)

  const { currentUser } = useAuth()

  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: true,
    })

    if (!result.canceled) {
      setEditProfile({ ...editProfile, profilePicture: result.assets[0].uri })
    }
  }

  const checkChanges = () => {
    if (isLoading) return false
    
    return (
      editProfile.description !== profile.description ||
      editProfile.displayName !== profile.displayName ||
      editProfile.profilePicture !== profile.profilePicture
    )
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getUserProfile(currentUser)
      setProfile(res)
      setEditProfile({
        description: res.description,
        displayName: res.displayName,
        profilePicture: null,
      })
      setLoading(false)
    }

    if (currentUser) {
      fetchProfile()
    }
  }, [currentUser])

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          position: "relative",
          backgroundColor: Colors.lightGray,
        }}
      >
        <View style={styles.container}>
          <View style={styles.profilePictureContainer}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: !isLoading
                  ? editProfile?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${profile.email}&size=128&background=random`
                  : null,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
              }}
            >
              <TouchableOpacity onPress={imagePicker} activeOpacity={1}>
                <View style={styles.profilePictureButton}>
                  <PhotoIcon size={18} color={Colors.white} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputlabelContainer}>
              <Text style={styles.inputlabel}>Nama</Text>
              <PencilSquareIcon size={18} color={Colors.black} />
            </View>
            {!isLoading ? (
              <TextInputField
                value={editProfile.displayName}
                setValue={(val) =>
                  setEditProfile({ ...editProfile, displayName: val })
                }
                placeholder="Masukkan nama Anda"
              />
            ) : (
              <TextSkeleton isLoading={isLoading} />
            )}
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputlabelContainer}>
              <Text style={styles.inputlabel}>Tentang Saya</Text>
              <PencilSquareIcon size={18} color={Colors.black} />
            </View>
            {!isLoading ? (
              <TextInputField
                value={editProfile.description}
                setValue={(val) =>
                  setEditProfile({ ...editProfile, description: val })
                }
                textArea
                placeholder="Ceritakan tentang Anda"
              />
            ) : (
              <TextSkeleton isLoading={isLoading} />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputlabel}>Email</Text>
            {!isLoading ? (
              <TextInputField value={profile.email} disabled={true} />
            ) : (
              <TextSkeleton isLoading={isLoading} />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputlabel}>Username</Text>
            {!isLoading ? (
              <TextInputField value={`@${profile.username}`} disabled={true} />
            ) : (
              <TextSkeleton isLoading={isLoading} />
            )}
          </View>
          {!isLoading ? (
            <Text
              style={{
                fontFamily: "Nunito-Regular",
                fontSize: 16,
                // alignSelf: "center",
                paddingTop: 4,
                paddingBottom: 16,
              }}
            >
              Daftar Pada{" "}
              <Text style={{ fontFamily: "Nunito-Bold" }}>
                {formatTimestamp(profile.createdAt.toDate())}
              </Text>
            </Text>
          ) : (
            <View
              style={{
                paddingTop: 4,
                paddingBottom: 16,
              }}
            >
              <TextSkeleton isLoading={isLoading} />
            </View>
          )}
          {/* <Text>{JSON.stringify(result)}</Text> */}
        </View>
      </ScrollView>
      <Shadow
        style={{ width: "100%" }}
        offset={[0, -1]}
        distance={8}
        startColor={Colors.shadow}
      >
        <View style={styles.footerContainer}>
          <StyledButton
            loading
            // onPress={handleSubmit}
            title="Simpan perubahan"
            disabled={!checkChanges()}
          />
        </View>
      </Shadow>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 24,
    margin: 16,
    gap: 24,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  profilePictureContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: Colors.accent,
    padding: 2,
    marginVertical: 16,
    width: 121,
    alignSelf: "center",
  },
  profilePicture: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#9FA3B8",
  },
  profilePictureButton: {
    padding: 8,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  inputContainer: {
    gap: 8,
  },
  inputlabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inputlabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.black,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
})
