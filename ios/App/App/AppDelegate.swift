import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = MainViewController()
        window?.makeKeyAndVisible()
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

// MARK: - MainViewController
class MainViewController: UIViewController {
    
    var bridgeViewController: CAPBridgeViewController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if UIDevice.current.userInterfaceIdiom == .pad {
            setupIPadLayout()
        } else {
            setupIPhoneLayout()
        }
    }
    
    private func setupIPadLayout() {
        let sidebarVC = SidebarViewController()
        let bridgeVC = CAPBridgeViewController()
        self.bridgeViewController = bridgeVC
        
        let splitVC = UISplitViewController(style: .doubleColumn)
        splitVC.setViewController(sidebarVC, for: .primary)
        splitVC.setViewController(bridgeVC, for: .secondary)
        
        splitVC.preferredDisplayMode = .oneBesideSecondary
        splitVC.preferredSplitBehavior = .tile
        
        addChild(splitVC)
        view.addSubview(splitVC.view)
        splitVC.view.frame = view.bounds
        splitVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        splitVC.didMove(toParent: self)
        
        sidebarVC.onItemSelected = { [weak self] path in
            self?.navigateWebView(to: path)
        }
    }
    
    private func setupIPhoneLayout() {
        let bridgeVC = CAPBridgeViewController()
        self.bridgeViewController = bridgeVC
        
        addChild(bridgeVC)
        view.addSubview(bridgeVC.view)
        bridgeVC.view.frame = view.bounds
        bridgeVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        bridgeVC.didMove(toParent: self)
    }
    
    private func navigateWebView(to path: String) {
        let js = "window.location.href = '\(path)'"
        bridgeViewController?.webView?.evaluateJavaScript(js, completionHandler: nil)
    }
}

// MARK: - SidebarViewController
class SidebarViewController: UIViewController {
    
    var onItemSelected: ((String) -> Void)?
    
    private let items = [
        (title: "Timeline", icon: "clock", path: "/timeline"),
        (title: "Lexicon", icon: "book", path: "/lexicon"),
        (title: "About", icon: "about", path: "/about")
    ]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    private func setupView() {
        let blurEffect = UIBlurEffect(style: .systemThinMaterial)
        let visualEffectView = UIVisualEffectView(effect: blurEffect)
        visualEffectView.frame = view.bounds
        visualEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(visualEffectView)
        
        let vibrancyEffect = UIVibrancyEffect(blurEffect: blurEffect, style: .label)
        let vibrancyView = UIVisualEffectView(effect: vibrancyEffect)
        vibrancyView.frame = view.bounds
        vibrancyView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        visualEffectView.contentView.addSubview(vibrancyView)
        
        setupCollectionView(in: vibrancyView.contentView)
    }
    
    private func setupCollectionView(in container: UIView) {
        let layout = UICollectionViewCompositionalLayout.list(using: .init(appearance: .sidebarPlain))
        let collectionView = UICollectionView(frame: container.bounds, collectionViewLayout: layout)
        collectionView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        collectionView.backgroundColor = .clear
        collectionView.delegate = self
        collectionView.dataSource = self
        collectionView.register(UICollectionViewListCell.self, forCellWithReuseIdentifier: "cell")
        
        container.addSubview(collectionView)
    }
}

extension SidebarViewController: UICollectionViewDelegate, UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return items.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath) as! UICollectionViewListCell
        let item = items[indexPath.row]
        
        var content = cell.defaultContentConfiguration()
        content.text = item.title
        content.image = UIImage(systemName: item.icon)
        content.textProperties.font = .preferredFont(forTextStyle: .headline)
        
        cell.contentConfiguration = content
        cell.backgroundConfiguration = .clear()
        
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let item = items[indexPath.row]
        onItemSelected?(item.path)
    }
}
