#![no_main]

use libfuzzer_sys::fuzz_target;
use std::path::PathBuf;
use segmentdesign_core::candidate::parse_candidate_strings;
use segmentdesign_core::candidate::Candidate;
use segmentdesign_core::location::Location;

// fuzz_target!(|data: &[u8]| {
//     if let Ok(s) = std::str::from_utf8(data) {
//         let _ = parse_candidate_strings(s, false);
//     }
// });

fuzz_target!(|data: &[u8]| {
    if let Ok(s) = std::str::from_utf8(data) {
        let _ = parse_candidate_strings(s, false)
            .into_iter()
            .map(|(c, _)| {
                Candidate::new(c, Location {
                    file: PathBuf::new(),
                    start: (0, 1),
                    end: (0, 1),
                })
            })
            .collect::<Vec<_>>();
    }
});
