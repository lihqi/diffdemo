import React from "react";
import DiffMatchPatch from "diff-match-patch";
import PropTypes from "prop-types";

const styles = {
  added: {
    color: "green",
    backgroundColor: "#b5efdb"
  },
  removed: {
    color: "red",
    backgroundColor: "#fec4c0",
    textDecoration: "line-through"
  }
};

const DMP = ({ string1 = "", string2 = "", cleanUp, editCost = 4 }) => {
  const dmp = new DiffMatchPatch();

  const diff = dmp.diff_main(string1, string2);
  if (cleanUp === "semantic") dmp.diff_cleanupSemantic(diff);
  if (cleanUp === "efficiency") {
    dmp.Diff_EditCost = editCost;
    dmp.diff_cleanupEfficiency(diff);
  }
  console.log("DMP diff groups", diff);
  const mappedNodes = diff.map((group) => {
    const key = group[0];
    let value = group[1];
    if ((key === -1 || key === 1) && !/\S/.test(value)) {
      const linebreaks = value.match(/(\S)*(\r\n|\r|\n)/g);
      // console.log(`contains ${linebreaks.length} new line`, linebreaks);
      if (linebreaks) {
        if (key === -1) value = `\u00b6`.repeat(linebreaks.length);
        if (key === 1) value = `\u00b6\n`.repeat(linebreaks.length);
      }
    }
    let nodeStyles;
    if (key === 1) nodeStyles = styles.added;
    if (key === -1) nodeStyles = styles.removed;
    return <span style={nodeStyles}>{value}</span>;
  });

  return <span style={{ whiteSpace: "pre" }}>{mappedNodes}</span>;
};

DMP.propTypes = {
  string1: PropTypes.string,
  string2: PropTypes.string,
  mode: PropTypes.oneOf(["characters", "words"])
};

export default DMP;
