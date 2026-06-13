#!/bin/bash
# Override Gradle JVM args to allow more heap memory for the build
echo "Setting GRADLE_OPTS to allow more heap memory..."
export GRADLE_OPTS='-Dorg.gradle.jvmargs="-XX:MaxMetaspaceSize=2g -Xmx8g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8" -Dorg.gradle.parallel=true -Dorg.gradle.daemon=false'
echo "GRADLE_OPTS set to: $GRADLE_OPTS"
