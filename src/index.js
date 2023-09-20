import React from "react";
import ReactDOM from "react-dom";
import Diff from "./Diff";
import DMP from "./DMP";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import stringSimilarity from "string-similarity";
import DiffMatchPatch from "diff-match-patch";
import wordsCount from "words-count";

const INIT_STRING_1 = `yellow leaves
taste the autumn
welcome the winter
-------
very long lines
long lines?
say no more. trivago`;
const INIT_STRING_2 = `yellow leaves
taste the autumn
welcome the winter------
very long lines
long lines?
say no more. trivago`;

class App extends React.Component {
  dmp = new DiffMatchPatch();

  state = {
    string1: INIT_STRING_1,
    string2: INIT_STRING_2,
    editCost: 4
  };

  onEditCostBlur = (e) => {
    this.setState({
      editCost: e.target.value
    });
  };

  onTextAreaBlur = (e, stateName) => {
    this.setState({
      [stateName]: e.target.value
    });
  };

  render() {
    const { string1, string2, editCost } = this.state;
    const similarity = stringSimilarity.compareTwoStrings(string1, string2);
    const diff = this.dmp.diff_main(string1, string2);
    const distance = this.dmp.diff_levenshtein(diff);
    return (
      <main>
        <label for="string1">String 1</label>&nbsp;
        <textarea
          id="string1"
          name="string1"
          rows="4"
          cols="50"
          onBlur={(e) => this.onTextAreaBlur(e, "string1")}
        >
          {INIT_STRING_1}
        </textarea>
        <br />
        <label for="string2">String 2</label>&nbsp;
        <textarea
          id="string2"
          name="string2"
          rows="4"
          cols="50"
          onBlur={(e) => this.onTextAreaBlur(e, "string2")}
        >
          {INIT_STRING_2}
        </textarea>
        <br />
        <button>Compute</button>
        <h4>String Similarity:{similarity}</h4>
        <h4>String Levenshtein Dis:{distance}</h4>
        <h4>Line Breaks: {string2.match(/[^\n]*\n[^\n]*/gi)?.length}</h4>
        <h4>Word Count: {wordsCount(string2)}</h4>
        <hr />
        <h1>Library 1: jsdiff </h1>
        <h2>Letter-by-letter diff</h2>
        <Diff string1={string1} string2={string2} mode="characters" />
        <br />
        <h2>{"Word diff"}</h2>
        <Diff string1={string1} string2={string2} mode="words" />
        <br />
        <h2>{"Line diff"}</h2>
        <Diff string1={string1} string2={string2} mode="lines" />
        <br />
        <h2>{"Sentence diff"}</h2>
        <Diff string1={string1} string2={string2} mode="sentences" />
        <br />
        <hr />
        <h1>Library 2: Diff Match Patch </h1>
        <h2>No cleanup</h2>
        <DMP string1={string1} string2={string2} />
        <h2>Semantic cleanup</h2>
        <DMP string1={string1} string2={string2} cleanUp={"semantic"} />
        <h2>Efficiency cleanup</h2>
        <label for="editCost">Edit Cost</label>&nbsp;
        <input
          id="editCost"
          type="number"
          onChange={this.onEditCostBlur}
          placeholder={editCost}
        />
        <br />
        <DMP
          string1={string1}
          string2={string2}
          cleanUp={"efficiency"}
          editCost={editCost}
        />
        <br />
        <hr />
        <h1>Library 3:React Diff Viewer </h1>
        <ReactDiffViewer
          oldValue={string1}
          newValue={string2}
          // {...(similarity < 0.75 && { disableWordDiff: true })}
          hideLineNumbers
          compareMethod={DiffMethod.WORDS}
          splitView={true}
        />
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
