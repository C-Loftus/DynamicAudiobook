import React, { useState, useEffect } from "react";
import { View, TextInput } from "react-native";

interface WikiSearchProps {
  onResult: (result: string) => void;
}

const WikiSearch: React.FC<WikiSearchProps> = ({ onResult }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (input) {
      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${input}&explaintext=1&formatversion=2&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          const result = pages[pageId].extract
            ? pages[pageId].extract
            : "No results found";
          onResult(result);
        })
        .catch((err) => console.error(err));
    }
  }, [input, onResult]);

  return (
    <View>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={{ color: "white" }}
      />
    </View>
  );
};

export default WikiSearch;
