import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  Picker,
} from "react-native";

import { client } from "./graphql/client";
import { TopHeadlines } from "./graphql/queries";
import { ArticleRow } from "./components/ArticleRow";
import { FiltersEngine } from "@cliqz/adblocker";

const styles = StyleSheet.create({
  headerText: {
    color: "#ff8d01",
    fontWeight: "bold",
    fontSize: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default class App extends React.Component {
  state = {
    articles: [],
    loading: true,
    pickerItem: "",
    selected: "business",
    engine: null,
  };

  componentDidMount() {
    this.requestTopHeadlines();
    FiltersEngine.fromPrebuiltFull(fetch).then((engine) => {
      this.setState({ engine: engine });
    });
    // FiltersEngine.fromLists(fetch, [
    //   "https://easylist.to/easylist/easylist.txt"
    // ]).then(engine => {
    //   this.setState({engine: engine})
    // });
  }

  // update picker item to whatever the user chooses
  updatePicker = (pickerPick) => {
    this.setState({ pickerItem: pickerPick }, () => {
      this.requestTopHeadlines();
    });
  };

  // Category options: business entertainment general health science sports technology

  requestTopHeadlines = () => {
    client
      .query({
        query: TopHeadlines,
        variables: { category: this.state.pickerItem }, // change the articles according to the category
      })
      .then((response) => {
        // console.log('response', response);
        this.setState({
          loading: response.loading,
          articles: response.data.headlines.articles,
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  renderFooter = () => {
    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return null;
  };

  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.articles}
          ListHeaderComponent={
            <>
              <Text style={styles.headerText}>Top Headlines</Text>
              <Picker
                style={{ width: "100%", height: 118 }}
                itemStyle={{ height: 108 }}
                onValueChange={this.updatePicker}
                selectedValue={this.state.pickerItem}
              >
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Science" value="science" />
                <Picker.Item label="Sports" value="sports" />
                <Picker.Item label="Technology" value="technology" />
              </Picker>
            </>
          }
          renderItem={({ item, index }) => (
            <ArticleRow
              index={index}
              engineGlobal={this.state.engine}
              {...item}
            />
          )}
          keyExtractor={(item) => `${item.publishedAt}-${item.title}`}
          ListFooterComponent={this.renderFooter()}
        />
      </SafeAreaView>
    );
  }
}
