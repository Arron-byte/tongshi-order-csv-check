# Keyboard and form feedback preflight

We checked one import form in the Tongshi AI CSV tool using synthetic files and an isolated desktop Chromium session. This is a preliminary sample of how we document interactions and findings. A full accessibility evaluation covers additional pages, states, devices and assistive technology. [W3C guidance on preliminary checks](https://www.w3.org/WAI/test-evaluate/preliminary/)

| Check | Observed result | Evidence |
| --- | --- | --- |
| Keyboard path | Tab reached the file input. Enter triggered the file chooser event. After selecting the fixture, Tab reached both mapping controls and the Check button. Enter and Space each ran the check and moved focus to the results heading. | [Keyboard focus on the file input](01-keyboard-file-focus.png) · [Keyboard focus on Check](02-keyboard-run-focus.png) |
| Labels and focus | The file input and the two mapping controls had associated labels. The file input referred to its instructions. On the file input and Check button, keyboard focus showed a three-pixel outline. | [Observed browser state and screenshots](proof.json) |
| Form feedback and recovery | An unclosed quote produced visible error text in the status region and hid the old results. The valid replacement file restored the results in the same tab. | [Error state](03-invalid-file-status.png) · [Recorded retest](proof.json) |

The run made two loopback GET requests and observed zero off-scope requests or browser errors. It recorded the status-region text and semantics in Chromium. Spoken announcements and the native file chooser interface require separate verification. [Run evidence and artifact hashes](proof.json)

The [original browser QA report](../) includes the synthetic files and manual reproduction steps.
