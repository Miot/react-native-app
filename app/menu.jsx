import { View, Text, StyleSheet, Appearance, Platform, SafeAreaView, ScrollView, FlatList, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { MENU_ITEMS } from "@/constants/MenuItems";
import MENU_IMAGES from "@/constants/MenuImages";

export default function Menu() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
  const separator = () => <View style={styles.separator} />;
  const footerComp = () => <Text style={{ color: theme.text }}>End of Menu</Text>;
  const emptyComp = () => <Text>No items</Text>;
  return (
    <Container>
      <FlatList 
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={separator}
        ListFooterComponent={footerComp}
        ListFooterComponentStyle={styles.footerComp}
        ListEmptyComponent={emptyComp}
        renderItem={({item}) => 
          <View style={styles.row}>
            <View style={styles.menuTextRow}>
              <Text style={[styles.menuTitle, styles.menuText]}>{item.title}</Text>
              <Text style={styles.menuText}>{item.description}</Text>
            </View>
            <Image style={styles.menuImage} source={MENU_IMAGES[item.id - 1]} />
          </View>
        }
      />
    </Container>
  )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    separator: {
      height: 1,
      width: '50%',
      maxWidth: 300,
      marginHorizontal: 'auto',
      marginBottom: 10,
      backgroundColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
    },
    footerComp: {
      color: theme.text,
      marginHorizontal: 'auto',
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      maxWidth: 600,
      height: 100,
      marginBottom: 10,
      borderStyle: 'solid',
      borderColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
      borderWidth: 1,
      borderRadius: 20,
      overflow: 'hidden',
      marginHorizontal: 'auto',
    },
    menuTextRow: {
      width: '65%',
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 5,
      flexGrow: 1,
    },
    menuTitle: {
      fontSize: 18,
      textDecorationLine: 'underline',
    },
    menuText: {
      color: theme.text,
    },
    menuImage: {
      width: 100,
      height: 100,
    }
  })
}
