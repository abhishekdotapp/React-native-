import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import MovieDisplayCard from "@/components/MovieCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect

  useEffect(() => {
    
    if (searchQuery === "") {
      reset();
      return;
    }
    const timeoutId = setTimeout( async() => {
      await loadMovies();
    }, 500);
  

  return () => clearTimeout(timeoutId);
}, [searchQuery]);

useEffect(() => {
    setSearchQuery("batman");
    }, []);



return (
  <View className="flex-1 bg-primary">
    <Image
      source={images.bg}
      className="flex-1 absolute w-full z-0"
      resizeMode="cover"
    />

    <FlatList
      className="px-5"
      data={movies as Movie[]}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MovieDisplayCard {...item} />}
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: "flex-start",
        gap: 16,
        marginVertical: 16,
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListHeaderComponent={
        <>
          <View className="w-full flex-row justify-center mt-20 items-center">
            <Image source={icons.logo} className="w-12 h-10" />
          </View>

          <View className="my-5">
            <SearchBar
              placeholder="Search for a movie"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="my-3"
            />
          )}

          {error && (
            <Text className="text-red-500 px-5 my-3">
              Error: {error.message}
            </Text>
          )}

          {!loading &&
            !error &&
            (
              <Text className="text-xl text-white font-bold">
                Search Results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
        </>
      }

    />
  </View>
);
};

export default Search;