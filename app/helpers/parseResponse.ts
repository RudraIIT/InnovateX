export const parseResponse = (llm_response : string) => {
  const possibleTagChar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/".split("");
  let onGoingTag = "";
  let onGoingData = "";
  let currentTag = "";
  let onGoingCurrentTag = false;
  let name = "";
  let path = "";
  let content = "";
  interface File {
    name: string;
    path: string;
    content: string;
  }
  const response = {
    files: [] as File[],
    response: "",
    title: ""
  }
  for (const char of llm_response) {
    if (char === `<`) {
      currentTag = "";
      onGoingCurrentTag = true;
    } else if (char === ">" && onGoingCurrentTag) {
      onGoingCurrentTag = false;
      if (currentTag === "CodeParserFile") {
        onGoingTag = "CodeParserFile";
      } else if (currentTag === "CodeParserName") {
        onGoingTag = "CodeParserName";
      } else if (currentTag === "CodeParserPath") {
        onGoingTag = "CodeParserPath";
      } else if (currentTag === "CodeParserContent") {
        onGoingTag = "CodeParserContent";
      } else if (currentTag === "CodeParserResponse") {
        onGoingTag = "CodeParserResponse";
      } else if (currentTag == "CodeParserTitle") {
        onGoingTag = "CodeParserTitle";
      } else if (currentTag === "/CodeParserFile" || currentTag === "/CodeParserResponse" || currentTag === "/CodeParserName" || currentTag === "/CodeParserPath" || currentTag === "/CodeParserContent" || currentTag === "/CodeParserTitle") {
        onGoingTag = "";
        if (currentTag == "/CodeParserFile") {
          response.files.push({
            name: name.split('\n').pop()?.trim() || "",
            path,
            content
          });
        }
        else if (currentTag == "/CodeParserResponse") {
          const data = {
            response : onGoingData.trimStart().trimStart(),
            end: true
          }
          response.response = data.response;
        } else if (currentTag == "/CodeParserName") {
          onGoingData = onGoingData.replace("```xml", "");
          name = onGoingData.trimStart().trimStart();
        } else if (currentTag == "/CodeParserPath") {
          const data = {
            name,
            path : onGoingData.trimStart().trimStart()
          };
          path = data.path;
        } else if (currentTag == "/CodeParserContent") {
          const data = {
            name,
            path,
            content : onGoingData.trimStart().trimStart(),
            end: true
          };
          content = data.content;
        } else if (currentTag == "/CodeParserTitle") {
          const data = {
            title : onGoingData.split('```')[2].split('\n')[1] || onGoingData.split('```')[2].split('\n')[0] ||onGoingData.split('\n')[1] || onGoingData.split('\n')[0] || onGoingData.split('```')[1] || onGoingData.split('```')[0] || onGoingData,
          };
          response.title = data.title;
        }
        onGoingData = "";
      } else {
        onGoingData += "<" + currentTag + ">";
      }
    } else {
      if (onGoingCurrentTag) {
        currentTag += char;
        if (!possibleTagChar.includes(char)) {
          onGoingCurrentTag = false;
          onGoingData += "<" + currentTag;
        }
      } else {
        onGoingData += char;
      }
    }
  }
  return response;
}