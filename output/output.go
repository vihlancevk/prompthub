package output

import (
	"io"
	"log"
	"os"

	jww "github.com/spf13/jwalterweatherman"
)

var (
	DEBUG *log.Logger
	INFO  *log.Logger
	ERROR *log.Logger
	FATAL *log.Logger

	np *jww.Notepad
)

const DefaultVerbosity = jww.LevelInfo

func Init(verbosity int) {
	threshold := DefaultVerbosity
	switch verbosity {
	case 0:
		threshold = jww.LevelFatal
	case 1:
		threshold = jww.LevelInfo
	case 2:
		threshold = jww.LevelDebug
	}

	np = jww.NewNotepad(threshold, threshold, os.Stdout, io.Discard, "", 0)
	DEBUG = np.DEBUG
	INFO = np.INFO
	ERROR = np.ERROR
	FATAL = np.FATAL
}
