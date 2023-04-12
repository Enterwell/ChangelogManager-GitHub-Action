# Changelog Manager GitHub Action changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**NOTE: This is an automatically generated file. Do not modify contents of this file manually.**

## [3.0.1] - 2023-04-12
### Fixed
- Release action creates GH release

## [3.0.0] - 2023-04-12
### Changed
- Updated the action to v3! 🎉
- BREAKING CHANGE Renamed 'set-version-flag' input to 'should-bump-version'
- BREAKING CHANGE Internally using CoreApp v3 that now bumps by default based on keyword instead of change type

## [2.0.0] - 2023-04-12
### Added
- Managing the action repository CHANGELOG using this exact action!

### Changed
- Updated the action to v2! 🎉
- Updated the README

### Removed
- Explicit semantic version input

## [1.0.0] - 2023-04-08
### Added
+ Project initialized along with the action v1 and a README
+ Testing using Jest
+ CI workflow
+ CodeQL workflow
