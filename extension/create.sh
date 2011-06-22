#! /bin/bash

cd chrome
zip -r ljs_toolbar.jar content/* skin/*
cd ..
zip ljs_toolbar.xpi install.rdf chrome.manifest chrome/ljs_toolbar.jar
