#!/usr/bin/env ruby

cmd = "casperjs test tests/testcases/ --includes=tests/inc.js"
system(cmd)
exit $?.to_i
