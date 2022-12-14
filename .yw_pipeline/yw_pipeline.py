from youwol.environment import YouwolEnvironment
from youwol.routers.projects.models_project import BrowserApp, Execution, Link, BrowserAppGraphics, IPipelineFactory
from youwol.pipelines.pipeline_typescript_weback_npm import pipeline, PipelineConfig
from youwol_utils.context import Context


class PipelineFactory(IPipelineFactory):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    async def get(self, _env: YouwolEnvironment, context: Context):
        config = PipelineConfig(target=BrowserApp(
            displayName="Todos",
            execution=Execution(
                standalone=True
            ),
            graphics=BrowserAppGraphics(
                appIcon={'class': 'fas fa-check-circle fa-2x'},
                fileIcon={}
            ),
            links=[
                Link(name="doc", url="dist/docs/index.html"),
                Link(name="coverage", url="coverage/lcov-report/index.html"),
                Link(name="bundle-analysis", url="dist/bundle-analysis.html")
            ]
        ))
        return await pipeline(config, context)
