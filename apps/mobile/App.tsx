import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import ProjectsScreen from "./src/screens/ProjectsScreen";
import ProjectDetailScreen from "./src/screens/ProjectDetailScreen";
import BlogScreen from "./src/screens/BlogScreen";
import ArticleDetailScreen from "./src/screens/ArticleDetailScreen";
import ContactScreen from "./src/screens/ContactScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SkillsScreen from "./src/screens/SkillsScreen";
import ExperienceScreen from "./src/screens/ExperienceScreen";
import AIAssistantScreen from "./src/screens/AIAssistantScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProjectsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProjectsList" component={ProjectsScreen} options={{ title: "Projects" }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Project" }} />
    </Stack.Navigator>
  );
}
function BlogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BlogList" component={BlogScreen} options={{ title: "Blog" }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: "Article" }} />
    </Stack.Navigator>
  );
}
function MoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="Skills" component={SkillsScreen} options={{ title: "Skills" }} />
      <Stack.Screen name="Experience" component={ExperienceScreen} options={{ title: "Experience" }} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} options={{ title: "AI Assistant" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Projects" component={ProjectsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Blog" component={BlogStack} options={{ headerShown: false }} />
        <Tab.Screen name="Contact" component={ContactScreen} />
        <Tab.Screen name="More" component={MoreStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
