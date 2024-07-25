import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native"
import { Colors } from "../../../../themes/Colors"
import { useAuth } from "../../../../contexts/AuthContext"
import { useCallback, useEffect, useState } from "react"
import {
  router,
  useFocusEffect,
  useNavigation,
} from "expo-router"
import {
  ChevronRightIcon as ArrowIcon,
  ArchiveBoxIcon,
  ClockIcon,
  Cog6ToothIcon as Cog,
  ArrowLeftEndOnRectangleIcon as LogoutIcon,
} from "react-native-heroicons/solid"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserProfile } from "../../../../models/profileModel"
import { showToast } from "../../../../libs/utils"

interface ProfileMenuProps {
  children: any
  label: string
  color?: string
  path?: string
  onPress?: () => void
}

function ProfileMenu({
  children,
  label,
  color,
  path,
  onPress,
}: ProfileMenuProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress ? onPress : () => router.navigate(path)}
    >
      <View style={styles.menuItemContainer}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          <View style={[styles.menuItemIcon, { backgroundColor: color }]}>
            {children}
          </View>
          <Text style={styles.textmenu}>{label}</Text>
        </View>
        <ArrowIcon size={20} color={Colors.black} />
      </View>
    </TouchableOpacity>
  )
}

export default function Profile() {
  const { currentUser, userSignOut } = useAuth()
  const [profile, setProfile] = useState(null)

  const navigation = useNavigation()

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(["guest", "not_first_time"])

      navigation.reset({
        index: 0,
        routes: [{ name: "signin" }],
      })
      if (currentUser) await userSignOut()
      showToast("Akun berhasil dikeluarkan")
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProfile = async () => {
    try {
      const profile = await getUserProfile(currentUser.uid)
      setProfile(profile)
    } catch (error) {
      showToast("Gagal memuat profil Anda")
      console.log(error?.message || "Error, something happened")
    }
  }

  useFocusEffect(useCallback(() => {
    if (currentUser) {
      fetchProfile()
    }
  }, []))

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        position: "relative",
        backgroundColor: Colors.lightGray,
      }}
    >
      <View style={styles.container}>
        {profile && (
          <View style={styles.profileHeader}>
            <View style={styles.profilePictureContainer}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: profile?.profilePicture
                    ? profile.profilePicture
                    : `https://ui-avatars.com/api/?name=${profile.email}&size=128&background=random`,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={styles.profileDetailContainer}>
              <Text style={styles.displayname}>{profile.displayName}</Text>
              <View style={styles.usernameContainer}>
                <Text style={styles.username}>{`@${profile.username}`}</Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.profileMenu}>
          <ProfileMenu
            label="Arsip Laporan"
            path="profile/postarchive"
            color={Colors.secondary}
          >
            <ArchiveBoxIcon size={18} color={Colors.primaryDark} />
          </ProfileMenu>
          <ProfileMenu
            label="Riwayat Laporan"
            path="profile/posthistory"
            color={Colors.secondary}
          >
            <ClockIcon size={18} color={Colors.primaryDark} />
          </ProfileMenu>
          <ProfileMenu
            label="Edit Profil"
            path="profile/editprofile"
            color={Colors.secondary}
          >
            <Cog size={18} color={Colors.primaryDark} />
          </ProfileMenu>
          <View style={{ height: 1, backgroundColor: Colors.secondary }}></View>
          <ProfileMenu label="Keluar" color="#F5E5E5" onPress={handleSignOut}>
            <LogoutIcon size={18} color="#7E3232" />
          </ProfileMenu>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  profileHeader: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  profilePictureContainer: {
    flex: 1,
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: Colors.accent,
    padding: 2,
    overflow: "hidden",
  },
  profilePicture: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#9FA3B8",
  },
  profileDetailContainer: {
    paddingRight: 4,
    flex: 2.5,
    gap: 8,
  },
  displayname: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: Colors.black,
    lineHeight: 24,
  },
  usernameContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignSelf: "flex-start",
  },
  username: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: Colors.white,
  },
  profileMenu: {
    display: "flex",
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  menuItemContainer: {
    display: "flex",
    gap: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    padding: 8,
    width: 46,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  textmenu: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
  },
})
