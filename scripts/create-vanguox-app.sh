#!/bin/bash

# Get folder name from the command line argument
folderName=$1

if [ -z "$folderName" ]; then
  echo "Please provide a folder name."
  exit 1
fi

# Create the folder inside src/vanguox-apps
folderPath="./src/vanguox-apps/$folderName"

if [ ! -d "$folderPath" ]; then
  mkdir -p "$folderPath"
  echo "Directory $folderName created."
else
  echo "Directory $folderName already exists."
fi
