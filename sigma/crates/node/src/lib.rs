use std::path::PathBuf;

#[macro_use]
extern crate napi_derive;

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ChangedContent {
  pub file: Option<String>,
  pub content: Option<String>,
  pub extension: String,
}

#[napi]
pub fn parse_candidate_strings_from_files(changed_content: Vec<ChangedContent>) -> Vec<String> {
  segmentdesign_core::parse_candidate_strings_from_files(
    changed_content
      .into_iter()
      .map(|changed_content| segmentdesign_core::ChangedContent {
        file: changed_content.file.map(PathBuf::from),
        content: changed_content.content,
        extension: changed_content.extension,
      })
      .collect(),
  )
}
